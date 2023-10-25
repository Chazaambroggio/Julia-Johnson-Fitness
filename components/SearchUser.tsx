'use client'
import React, { useState } from 'react'
import { UserProfile } from '@/common.types';
import CardUser from './CardUser';

type Props = {
    users: UserProfile[];
  };

const SearchUser = ({users} : Props) => {

    const [searchQuery, setSearchQuery] = useState('');

    // Filter and map the list
    const filteredList = users.filter((item) =>
      item.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    return (
        <section className='flex flex-col justify-center items-center w-full'>
            <input
                type="text"
                placeholder="Search username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full my-3 p-3 rounded-lg border border-slate-200'
            />
                
            {filteredList.map((item) => (
            
                <CardUser 
                    key={item._id}
                    user={item}
                />
                    
            ))}        
                  
        </section>
    )
}

export default SearchUser