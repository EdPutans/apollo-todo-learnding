import React from 'react';
import './App.css';
import { gql, useQuery, useMutation, cache } from '@apollo/client';

// name of Query is not mandatory
const GET_ALL_POSTS = gql`
query {
  posts {
    data {
      id
      title
    }
  }
}`

// analyze each line below
const ADD_A_POST = gql`
mutation ($post: CreatePostInput!){
  createPost(input: $post){
    id
    title
    body
  }
}`

const UPDATE_A_POST = gql`
mutation($id: ID!, $post: UpdatePostInput!){
  updatePost(id: $id, input: $post){
    id
    body
    title
  }
}
`

const DELETE_A_POST = gql`
mutation($id:ID!){
  deletePost(id: $id)
}`

function App() {
  const {data,loading,error} = useQuery(GET_ALL_POSTS)
  const [create, isMutating] = useMutation(ADD_A_POST, {
      update: (cache, {data: { createPost }}) =>{
        const existingPosts = cache.readQuery({
          query: GET_ALL_POSTS
        })
        console.log({existingPosts, createPost})
        cache.writeQuery({
          query: GET_ALL_POSTS,
          data: {
            posts: {
              data: [createPost, ...existingPosts?.posts?.data] 
            }
          }
        })
        console.log({finalResult: cache.readQuery({
          query: GET_ALL_POSTS
        })})
      }
  })
  const [updateMe, isUpdating] = useMutation(UPDATE_A_POST, {
    update: (cache, { data: { updatePost } })=>{
      const existingPosts = cache.readQuery({
        query: GET_ALL_POSTS
      })
      const index = existingPosts?.posts?.data.findIndex(item => item.id === updatePost.id)
      const updatedPosts = [...existingPosts?.posts?.data]
      updatedPosts[index] = updatePost;
      cache.writeQuery({
        query: GET_ALL_POSTS,
        data: {
          posts: {
            data: updatedPosts
          }
        }
      })

    }
  })
  const [deleteMe, isDeleting] = useMutation(DELETE_A_POST, {
    // The API returns no ID, so need to figure out a way to use this without setting ID in state
    update: (cache, {data: { deletePost }}) => {
      const existingPosts = cache.readQuery({
        query: GET_ALL_POSTS
      })
      cache.writeQuery({
        query: GET_ALL_POSTS,
        data: {
          posts: {
            data: existingPosts?.posts?.data?.filter(item => item.id !== deletePost.id)
          }
        }
      })
    }
  })
  if(loading){
    return 'loading';
  }
        if(!data){
          return 'nope';
        }
  if(error){
    return error?.message
  }

  return (
    <div className="App">
      <button onClick={() => create({
        variables: {
          post: { 
            title: "dabber",
             body: 'this is bodi'
            }
        }
      })}>add a bloody post</button>
      <header className="App-header">
        {data?.posts?.data?.map(post => 
        <div>
          <p>{post.title}  - {post.body}</p>
          <button onClick={()=> deleteMe({
            variables:{
              id: post.id,
            }
          }).then(r => console.log(r))
          }>DEL</button>
          <button onClick={()=>updateMe({
            variables: {
              id: post.id,
              post: {
                title: 'Ive been updated!',
                body: 'yeet'
              }
            }
          })}>update me</button>
        </div>)}
      </header>
      
    </div>
  );
}

export default App;
