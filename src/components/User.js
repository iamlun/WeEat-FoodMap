import styled from "styled-components";
import user from "../assets/user.png";
import { useAuth, googleSignIn, setProfile, getProfile, handleSignIn } from "../utils/firebase";
import { Link } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";
import Swal from "sweetalert2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import signin from "../assets/signin.jpeg";


const UserImg=styled.img`
    height: 70px;
    width: 70px;
    object-fit: cover;
    border-radius: 10px;
    border: 0px;
    z-index: 99;
    cursor: pointer;
`
const LinkMyMap=styled(Link)`
    height: 70px;
    width: 70px;
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: white;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid white;
    z-index: 99;
    cursor: pointer;
`
const SignInWrapper=styled.div`
    height: 70px;
    width: 70px;
    position: fixed;
    top: 10px;
    right: 10px;
    background-color: white;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid white;
    z-index: 99;
    cursor: pointer;
`

const User = () => {
    const currentUser=useAuth();
    const imgURL= currentUser ? currentUser.photoURL:user;
    function handleClick(){
        Swal.fire({
            title: 'SIGN IN',
            text:'Sign In with Google',
            width: 800,
            color: 'rgba(27, 33, 29, 0.72)',
            showCancelButton:true,
            confirmButtonText: 'Ok',
            confirmButtonColor: 'rgba(254, 169, 220, 0.99)',
            cancelButtonColor: 'rgba(215, 208, 212, 0.99)',
            backdrop: `
                rgba(54, 66, 83, 0.9)
            `,
            imageUrl: `${signin}`,
            imageWidth: 600,
            imageHeight: 400,
            imageAlt: 'Custom image',
            background: 'rgba(254, 240, 248, 0.99)'
        }).then((result)=>{
            if(result.isConfirmed){
                handleSignIn()
                .then(()=>{
                    console.log('test');
                })
            }
        })
    }       
    return (currentUser ?
            <LinkMyMap to="/mymap">
            <UserImg src={imgURL} />
            </LinkMyMap>:
            <SignInWrapper onClick={handleClick}>
                <UserImg src={imgURL} />
            </SignInWrapper>
    );
}
 
export default User;