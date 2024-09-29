'use client'
import React, { useEffect, useState } from 'react'
import styles from './Login.module.scss'
import Image from 'next/image'
import { TextField } from '@mui/material'
import { AuthButton } from '../../ul/AuthButton/AuthButton'

import { useForm } from 'react-hook-form'

import { useDispatch, useSelector } from 'react-redux';
import { fetchAuth, fetchAuthMe, fetchReg, isAuth } from '@/redux/slices/auth';
import { AppDispatch } from '@/redux/store';
import { redirect } from 'next/navigation'

interface FormValues {
  fullName: string;
  email: string;
  password: string;
}
 
export const Login = () => {

  const dispatch = useDispatch<AppDispatch>();
  const isAuths = useSelector(isAuth);

  const [activeReg, setActiveReg] = useState(false);

  const {
    register: loginRegister,
    handleSubmit: loginHandleSubmit, 
    setError: loginSetError, 
    formState: { errors: loginErrors, isValid: loginIsValid }
  } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: ''
    },
  });

  const {
    register: regRegister,
    handleSubmit: regHandleSubmit, 
    setError: regSetError, 
    formState: { errors: regErrors, isValid: regIsValid }
  } = useForm<FormValues>({
    defaultValues: {
      fullName: '',
      email: '',
      password: ''
    },
  });

  const onSubmit = async (values: FormValues) => {
    const data = await dispatch(fetchAuth(values));

    if(!data.payload) {
      return alert('Не удалось авторизоваться!')
    }

    if (typeof data.payload === 'object' && 'token' in data.payload && typeof data.payload.token === 'string') {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  const onSubmitReg = async (values: FormValues) => {
    const data = await dispatch(fetchReg(values));

    if(!data.payload) {
      return alert('Не удалось зарегистрироваться!')
    }

    if (typeof data.payload === 'object' && 'token' in data.payload && typeof data.payload.token === 'string') {
      window.localStorage.setItem('token', data.payload.token)
    }
  }

  if(isAuths) {
    redirect('/planner/myday')
  }

  return (
    <div className={styles.form_block}>

        <div className={styles.block_left}>

              <div className={styles.logo}>
                  <Image 
                    src='/logo_login.svg'
                    width={74}
                    height={72}
                    alt='logo'
                  />
                  <span>Kepler Planner</span>
              </div>

        </div>

        <div className={styles.block_right}>

            <h2>Welcome to Kepler Planner</h2>

            <div className={styles.form_blocks}>

                <div className={`${styles.registration} ${activeReg ? `${styles.reg_active}` : ''}`}>

                  <form onSubmit={regHandleSubmit(onSubmitReg)}>

                    <div className={styles.inputs}>

                        <TextField 
                          label="Email"
                          variant="outlined"
                          className={styles.input}
                          type="text"
                          sx={{
                            "& .MuiOutlinedInput-root:hover": {
                              "& > fieldset": {
                                borderColor: "white"
                              }
                            },

                            "& .MuiOutlinedInput-root.Mui-focused": {
                              "& > fieldset": {
                                borderColor: "white"
                              }
                            }
                        
                          }}
                          error={Boolean(regErrors.email?.message)}
                          helperText={regErrors.email?.message}
                          {...regRegister('email', 
                          { 
                            required: 'Specify the email address',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: 'Invalid email address'
                            }
                           }
                        )} 
                        />

                        <TextField 
                          label="Name"
                          variant="outlined"
                          className={styles.input}
                          type="text"
                          sx={{
                            "& .MuiOutlinedInput-root:hover": {
                              "& > fieldset": {
                                borderColor: "white"
                              }
                            },

                            "& .MuiOutlinedInput-root.Mui-focused": {
                              "& > fieldset": {
                                borderColor: "white"
                              }
                            }
                        
                          }} 
                          error={Boolean(regErrors.fullName?.message)}
                          helperText={regErrors.fullName?.message}
                          {...regRegister('fullName', { 
                            required: 'Enter a name', 
                          maxLength: {
                            value: 20,
                            message: 'Name cannot be longer than 20 characters'
                            }
                          })}
                        />

                        <TextField 
                          label="Password"
                          variant="outlined"
                          className={styles.input}
                          type="password"
                          sx={{
                            "& .MuiOutlinedInput-root:hover": {
                              "& > fieldset": {
                                borderColor: "white"
                              }
                            },

                            "& .MuiOutlinedInput-root.Mui-focused": {
                              "& > fieldset": {
                                borderColor: "white"
                              }
                            }
                        
                          }} 
                          error={Boolean(regErrors.password?.message)}
                          helperText={regErrors.password?.message}
                          {...regRegister('password', { 
                            required: 'Enter the password',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters long'
                            },
                            pattern: {
                              value: /^(?=.*[A-Z])(?=.*\d).{8,}$/,
                              message: 'Password must contain at least one uppercase letter and one number'
                            }
                          })} 
                        />

                    </div>
                      
                    <AuthButton name='Create Account' />

                  </form>

                  <button className={styles.login_button}  onClick={() => setActiveReg(false)}>Log in</button>

                </div>

                <div className={`${styles.log_in_block} ${activeReg ? `${styles.login_active}` : ''}`}>

                  <form onSubmit={loginHandleSubmit(onSubmit)}>

                    <div className={styles.inputs}>

                          <TextField 
                            label="Email"
                            variant="outlined"
                            className={styles.input}
                            type="email"
                            sx={{
                              "& .MuiOutlinedInput-root:hover": {
                                "& > fieldset": {
                                  borderColor: "white"
                                }
                              },

                              "& .MuiOutlinedInput-root.Mui-focused": {
                                "& > fieldset": {
                                  borderColor: "white"
                                }
                              }
                          
                            }} 
                            error={Boolean(loginErrors.email?.message)}
                            helperText={loginErrors.email?.message}
                            {...loginRegister('email', { required: 'Specify the email address' })}
                          />

                          <TextField 
                            label="Password"
                            variant="outlined"
                            className={styles.input}
                            type="password"
                            sx={{
                              "& .MuiOutlinedInput-root:hover": {
                                "& > fieldset": {
                                  borderColor: "white"
                                }
                              },

                              "& .MuiOutlinedInput-root.Mui-focused": {
                                "& > fieldset": {
                                  borderColor: "white"
                                }
                              }
                          
                            }} 
                            error={Boolean(loginErrors.password?.message)}
                            helperText={loginErrors.password?.message}
                            {...loginRegister('password', { required: 'Enter the password' })}
                          />

                    </div>

                    <AuthButton name='Log In' />

                  </form>

                  <button className={styles.login_button} onClick={() => setActiveReg(true)}>Create Account</button>

                </div>

            </div>

        </div>

    </div>
  )
}
