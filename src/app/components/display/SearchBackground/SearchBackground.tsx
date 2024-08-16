'use client'
import React, { useEffect, useState } from 'react'
import styles from './SearchBackground.module.scss'
import Image from 'next/image'
import { IoSearchOutline } from "react-icons/io5";
import instance, { backgroundSearch } from '@/service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { authSlice } from '@/redux/slices/auth';
import { IoClose } from "react-icons/io5";
import { setOpenBack } from '@/redux/slices/pin';

interface cards {
  urls: any
}

export const SearchBackground = () => {

  const [resultsSearch, setResultsSearch] = useState<cards[]>([]);
  const [backgroundSearchs, setBackgroundSearchs] = useState<string>('');
  const [searchInitiated, setSearchInitiated] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false);  

  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.data) as any; 

  const isBack = useSelector((state: RootState) => state.pin.openBack);

  const handBackgroundSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchInitiated(true);
    setLoading(true);
    try {
     const response = await backgroundSearch.get('/search/photos', {
      params: {
        query: backgroundSearchs,
        per_page: 30, 
      },
     });
     setResultsSearch(response.data.results)
    } catch(err) {
      console.error('Error searching photos:', err);
    } finally {
      setLoading(false);
    }
  }

  const handClickCard = async (url: string) => {
    const updateBack = {
      userId: user?._id,
      backgroundImage: url
    }

    try { 
      await instance.patch('/select-background', updateBack);
      dispatch(authSlice.actions.setBackground(url));
    } catch(err) {
      console.error('err:', err)
    }
  }

  return (
    <div className={`${styles.searchBackground} ${isBack ? `${styles.active_search_background}` : ''}`}>

      <div className={styles.ss}>
        <div className={styles.modal}>
              <label className={styles.search}>
                  <form onSubmit={handBackgroundSearch}>
                      <IoSearchOutline />
                      <input 
                        type="text" 
                        placeholder='Search Background' 
                        value={backgroundSearchs}
                        onChange={e => setBackgroundSearchs(e.target.value)}
                      />
                  </form>
              </label>

              <div className={styles.grids}>

              {loading ? (  
                  <p className='m-auto col-span-4 font-bold'>Loading...</p>
                ) : searchInitiated && resultsSearch.length === 0 ? (  
                  <p className='m-auto col-span-4 font-bold'>No results</p>
                ) : (
                  resultsSearch.map((cards, index) => (
                    <div 
                      key={index} 
                      onClick={() => handClickCard(cards?.urls?.regular)} 
                      className={`${styles.card} ${cards?.urls?.regular === user?.backgroundImage ? `${styles.activeBack}` : ''}`}
                    >
                      <img src={cards?.urls?.regular} alt="img" />
                    </div>
                  ))
                )}


              </div>
        </div>
      </div>

      <button className={styles.close} onClick={() => dispatch(setOpenBack(false))}><IoClose /></button>

    </div>
  )
}