import { createSlice, createAsyncThunk, createAction, createSelector } from "@reduxjs/toolkit";
import instance from "@/service";
 

    // all tasks
    export const fetchTasks = createAsyncThunk('/tasks/fetchTasks', async () => {
        const { data } = await instance.get('/tasks');
        return data;
    });

    // all tasks today
    export const taskToday = createAsyncThunk('/all/tasks/today', async () => {
        const { data } = await instance.get('/tasks/today/all');
        return data;
    });

    export const taskWeek = createAsyncThunk('/weekDays', async () => {
        const response = await instance.get('/weekdays');
        return response.data;
    });

    export const deleteTask = createAsyncThunk('/tasks/deleteTask', async (id: string) => {
        await instance.delete(`/tasks/${id}`);
        return id;
    });

    export const addTaskToDay = createAsyncThunk(
        'tasks/addTaskToDay',
        async ({ dayIndex, newTask }: any) => {
          try {
            const response = await instance.post(`/tasks/week`, newTask);
            if (response.status === 200) {
              return { dayIndex, task: response.data };
            }
          } catch (error) {
            console.error('Failed to add task:', error);
            throw error;
          }
        }
      );

        export const addNewTask = createAction('tasks/addNewTask', (newTaskData) => {
            return {
                payload: newTaskData
            };
        });


// patch tasks

    interface UpdateTaskArgs {
        taskId: string;
        updatedTask: any; 
    }

    export const updateTask = createAsyncThunk('/tasks/updateTask', async ({ taskId, updatedTask }: UpdateTaskArgs) => {
        const response = await instance.patch(`/tasks/${taskId}`, updatedTask);
        if (!response.data) {
            throw new Error('Server responded without data');
        }
        return response.data;
    });


// folders 

    export const foldersAll = createAsyncThunk('/fetchFolders', async () => {
        const { data } = await instance.get('/allFolders');
        return data;
    });
    
    //folderTask

    export const fetchFolderById = createAsyncThunk('/fetchFolderById', async (folderId: String) => {
        const { data } = await instance.get(`/folders/${folderId}`);
        return data;
    });

    export const addNewTaskFolder = createAction('tasks/addNewTaskFolder', (newTaskData, folderId) => {
        return {
            payload: { newTaskData, folderId }
        };
    });

    export const addNewTaskTodays = createAction('tasks/addNewTaskTodays', (text) => {
        return {
            payload: text 
        };
    });


    // current 

    export const selectTodayTasks = (state:any) => state.tasks.todayTasks;

    export const selectIncompleteTaskCount = createSelector([selectTodayTasks],
    (todayTasks) => todayTasks.items.filter((task:any) => !task.done).length
    );

    const selectWeekTasks = (state:any) => state.tasks.week.items;

    export const selectNextSevenDaysCount = createSelector(
        [selectWeekTasks],
        (weekTasks) => weekTasks.reduce((count:any, day:any) => count + day.tasks.filter((task:any) => !task.done).length, 0)
    );

    export const selectAllTasks = (state:any) => state.tasks.tasks;

    export const selectAllTasksCount = createSelector([selectAllTasks],
        (tasks) => tasks.items.filter((task:any) => !task.done).length
    );


// states

const initialState = { 
    tasks: {
        items: [] as any[],
        status: 'loading',
    },
    week: {
        items: [] as any[],
        status: 'loading',
    },
    folders:  {
        items: [] as any[],
        status: 'loading',
    },
    todayTasks: {
        items: [] as any[],
        status: 'loading',
    },
    taskId: null,
    taskCheck: false
}


const tasksSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        setTaskId: (state, action) => {
            state.taskId = action.payload;
        },
        setTaskCheck: (state, action) => {
            state.taskCheck = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addNewTask, (state, action) => {
                state.tasks.items.push(action.payload);
            })
            .addCase(addNewTaskFolder, (state, action) => {
                const { newTaskData, folderId } = action.payload;
                state.tasks.items.push(newTaskData);
    
                const folder = state.folders.items.find(folder => folder._id === folderId);
                if (folder) {
                    folder.tasks.push(newTaskData);
                }
            })
            .addCase(addNewTaskTodays, (state, action) => {
                state.todayTasks.items.push(action.payload);
                state.tasks.items.push(action.payload);

                const today = new Date();
                const currentDayOfWeek = today.getDay();

                let dayTasks = state.week.items.find(day => day.dayIndex === currentDayOfWeek);
                if (!dayTasks) {
                    dayTasks = {
                        dayIndex: currentDayOfWeek,
                        tasks: []
                    };
                    state.week.items.push(dayTasks);
                }
                dayTasks.tasks.push(action.payload);
            })
            .addCase(fetchTasks.pending, (state) => {
                state.tasks.items = [];
                state.tasks.status = 'loading';
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.tasks.items = action.payload;
                state.tasks.status = 'loaded';
            })
            .addCase(fetchTasks.rejected, (state) => {
                state.tasks.items = [];
                state.tasks.status = 'error';
            })
            .addCase(taskToday.pending, (state) => {
                state.todayTasks.status = 'loading';
            })
            .addCase(taskToday.fulfilled, (state, action) => {
                state.todayTasks.items = action.payload;
                state.todayTasks.status = 'loaded';
            })
            .addCase(taskToday.rejected, (state) => {
                state.todayTasks.items = [];
                state.todayTasks.status = 'error';
            })
            .addCase(updateTask.pending, (state) => {
                 state.todayTasks.status = 'loading';
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const updatedTask = action.payload;
            
                // Обновление задачи в week.items
                const dayIndex = state.week.items.findIndex(day => 
                    day.tasks.some((t:any) => t._id === updatedTask._id)
                );
                
                if (dayIndex !== -1) {
                    const taskIndex = state.week.items[dayIndex].tasks.findIndex((t:any) => 
                        t._id === updatedTask._id
                    );
                    
                    if (taskIndex !== -1) {
                        state.week.items[dayIndex].tasks[taskIndex] = {
                            ...state.week.items[dayIndex].tasks[taskIndex],
                            ...updatedTask
                        };
                    }
                }
            
                // Обновление задачи в tasks.items
                const taskToUpdateIndex = state.tasks.items.findIndex(task => task._id === updatedTask._id);
                if (taskToUpdateIndex !== -1) {
                    state.tasks.items[taskToUpdateIndex] = {
                        ...state.tasks.items[taskToUpdateIndex],
                        ...updatedTask
                    };
                }
            
                // Обновление задачи в todayTasks.items
                const todayTaskIndex = state.todayTasks.items.findIndex(task => task._id === updatedTask._id);
                if (todayTaskIndex !== -1) {
                    state.todayTasks.items[todayTaskIndex] = {
                        ...state.todayTasks.items[todayTaskIndex],
                        ...updatedTask
                    };
                }

                state.folders.items.forEach(folder => {
                    const folderTaskIndex = folder.tasks.findIndex((t:any) => t._id === updatedTask._id);
                    if (folderTaskIndex !== -1) {
                        folder.tasks[folderTaskIndex] = {
                            ...folder.tasks[folderTaskIndex],
                            ...updatedTask
                        };
                    }
                });
            })                       
            .addCase(updateTask.rejected, (state) => {
                state.tasks.status = 'error';
            })
            .addCase(addTaskToDay.fulfilled, (state, action) => {
                const { dayIndex, task }: any = action.payload;
                const dayTasks = state.week.items.find(item => item.dayIndex === dayIndex);
                if (dayTasks) {
                  dayTasks.tasks.push(task);
                  state.tasks.items.push(task);
                }
            })
            .addCase(taskWeek.pending, (state) => {
                state.week.items = [];
                state.week.status = 'loading';
            })
            .addCase(taskWeek.fulfilled, (state, action) => {
                state.week.items = action.payload;
                state.week.status = 'loaded';
            })
            .addCase(taskWeek.rejected, (state) => {
                state.week.items = [];
                state.week.status = 'error';
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                const deletedTaskId = action.payload;
            
                // Удаляем задачу из списка задач
                state.tasks.items = state.tasks.items.filter(task => task._id !== deletedTaskId);
            
                // Удаляем задачу из списка задач на сегодня
                state.todayTasks.items = state.todayTasks.items.filter(task => task._id !== deletedTaskId);
            
                // Удаляем задачу из списка задач в каждом дне недели
                state.week.items.forEach(day => {
                    day.tasks = day.tasks.filter((task: any) => task._id !== deletedTaskId);
                });

                // Удаляем задачу из папок пользователя
                state.folders.items.forEach(folder => {
                    folder.tasks = folder.tasks.filter((task: any) => task._id !== deletedTaskId);
                });
            })
            .addCase(foldersAll.pending, (state) => {
                state.folders.status = 'loading';
            })
            .addCase(foldersAll.fulfilled, (state, action) => {
                state.folders.items = action.payload;
                state.folders.status = 'loaded';
            })
            .addCase(foldersAll.rejected, (state) => {
                state.folders.items = [];
                state.folders.status = 'error';
            })
            .addCase(fetchFolderById.pending, (state) => {
                state.folders.status = 'loading';
            })
            .addCase(fetchFolderById.fulfilled, (state, action) => {
                const index = state.folders.items.findIndex(folderId => folderId._id === action.payload.id);
            
                if (index !== -1) {
                    (state.folders.items as any[])[index] = action.payload;
                }
                state.folders.status = 'loaded';
            })
            .addCase(fetchFolderById.rejected, (state) => {
                state.folders.items = [];
                state.folders.status = 'error';
            });                
    },
});

export const { setTaskId } = tasksSlice.actions;
export const { setTaskCheck } = tasksSlice.actions;
export const tasksReducer = tasksSlice.reducer;
