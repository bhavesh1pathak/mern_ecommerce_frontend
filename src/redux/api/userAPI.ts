import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import axios from "axios";
import { ALLUsersResponse, DeleteUserRequest, MessageResponse } from "../../types/api-types";
import { User } from "../../types/types";


export const userAPI = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/` }),

    tagTypes:["users"],
    endpoints: (builder) => ({
        login: builder.mutation<MessageResponse,User>({
            query: (User) => ({
                url: "new",
                method: "POST",
                body: User,
            }),
            invalidatesTags:["users"]
        }),

        deleteUser: builder.mutation<MessageResponse,DeleteUserRequest>({
            query: ({userId,adminUserId}) => ({
                url: `${userId}?id=${adminUserId}`,
                method: "DELETE",
                
            }),
            invalidatesTags:["users"]
        }),

        allUsers:builder.query<ALLUsersResponse,string>({
            query:id=>`all?id=${id}`,
            providesTags:["users"]
        })
    }),
});

export const getUser = async(id: string)=>{
    try{
       const {data} = await axios.get(`${import.meta.env.VITE_SERVER}/api/v1/user/${id}`);
 
       return data;
    }catch(error){

    }
}
export const {useLoginMutation,useAllUsersQuery,useDeleteUserMutation}=userAPI;