import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth, getProfile, getPostByUid } from "../utils/firebase";
import { useEffect } from "react";
import { useState } from "react";
const ProfileWrapper=styled.div`
    width: 800px;
    height: 800px;
    background-color: black;
    color: antiquewhite;
`
const Profile = () => {
    const {uid}=useParams();
    const navigate=useNavigate();
    const currentUser=useAuth();
    const [user,setUser]=useState();
    const [fetchDone,setFetchDone]=useState(false);
    const [post,setPost]=useState([]);
    useEffect(()=>{
        getProfile(uid)
        .then((res)=>{
            if(!res){
                alert('user-not-found');
                navigate('/');
            }
            setUser(res);
            getPostByUid(uid)
            .then((result)=>{
                setPost(result);
                setFetchDone(true);
            })
        })
        .catch((err)=>{
            console.log(err.message);
        })
    },[])
    console.log(user);
    console.log(post);
    console.log(fetchDone);
    return (
        <ProfileWrapper>
            {!(fetchDone) && <h1>Loading...</h1>}
            { (fetchDone) && 
              <h1>{user.name}</h1>
            }
        </ProfileWrapper>
    );
}
 
export default Profile;