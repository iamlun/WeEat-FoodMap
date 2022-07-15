import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, 
            createUserWithEmailAndPassword, 
            signInWithEmailAndPassword, 
            onAuthStateChanged, 
            signOut,
            signInWithPopup,
            GoogleAuthProvider } from "firebase/auth";
import { getDownloadURL, 
            getStorage, 
            ref, 
            uploadBytes } from "firebase/storage";
import { getFirestore,
            collection,
            addDoc,
            updateDoc,
            doc,
            deleteDoc,
            query,
            where,
            getDocs,
            serverTimestamp,
            setDoc, 
            getDoc,
            arrayRemove,
            arrayUnion} from "firebase/firestore";
const firebaseConfig = {
  apiKey: process.env.REACT_APP_KEY,
  authDomain: process.env.REACT_APP_DOMAIN,
  projectId: process.env.REACT_APP_PROJECTID,
  storageBucket: process.env.REACT_APP_BUCKET,
  messagingSenderId: process.env.REACT_APP_SENDERID,
  appId: process.env.REACT_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth= getAuth();
const storage=getStorage();
const db=getFirestore();
const provider=new GoogleAuthProvider();

//user auth function
function signup(email,password){
    return createUserWithEmailAndPassword(auth,email,password);
}
function login(email,password){
    return signInWithEmailAndPassword(auth,email,password);
}
function logout(){
    return signOut(auth);
}
function useAuth(){
    const [currentUser,setCurrentUser]=useState();
    useEffect(()=>{
        const unsub=onAuthStateChanged(auth,user => setCurrentUser(user));
        return unsub;
    },[])
    return currentUser;
}
//profile 
async function getProfile(uid){
    const docRef=doc(db,"profile",`${uid}`);
    const docSnap=await getDoc(docRef);
    return docSnap.data();
}
async function setProfile(uid,name,email,url){
    await setDoc(doc(db,"profile",`${uid}`),{
        name:name,
        email:email,
        photoURL:url,
    });
}
async function updateProfile(uid,name,file){
    const fileRef=ref(storage,`profile-image/${uid}.jpg`);
    const metatype={
        contentType:file.type,
    }
    const snapshot=await uploadBytes(fileRef,file,metatype);
    const photoURL=await getDownloadURL(fileRef);
    await setDoc(doc(db,"profile",`${uid}`),{
        name:name,
        photoURL:photoURL,
    });
}
async function updateProfileURL(uid,name,email,url){
    await setDoc(doc(db,"profile",`${uid}`),{
        name:name,
        email:email,
        photoURL:url,
    });
}

async function setMySavePost(uid,postid){
    const docRef=doc(db,"profile",`${uid}`);
    await updateDoc(docRef,{
        save:arrayUnion(postid)
    })
}
async function rmMySavePost(uid,postid){
    const docRef=doc(db,"profile",`${uid}`);
    await updateDoc(docRef,{
        save:arrayRemove(postid)
    })
}

async function getMySavePost(uid){
    const docRef=doc(db,"profile",`${uid}`);
    const docSnap=await getDoc(docRef);
    const posts=docSnap.data().save;
    let data=[];
    let id=[];
    if(posts){
        await Promise.all(posts.map(async (p,i)=>{
            const docRef=doc(db,"posts",`${p}`);
            const docSnap=await getDoc(docRef);
            data[i]=docSnap.data();
            id[i]=p;
        }))
    }else{
        data[0]=null;
        id[0]=null;
    }
    
    const results={
        data:data,
        id:id
    }
    return results;
}

//posts
async function setPostImage(file){
    const newPostRef=doc(collection(db,"posts"));
    const storageRef=ref(storage,`posts-image/${newPostRef.id}.jpg`);
    const metatype={
        contentType:file.type,
    }
    const uploadTask=await uploadBytes(storageRef,file,metatype);
    const postURL=await getDownloadURL(storageRef);

}
//include upload posts-image, set posts,set spots
async function setPost(body,file){
    const newPostRef=doc(collection(db,"posts"));
    const storageRef=ref(storage,`posts-image/${newPostRef.id}.jpg`);
    const metatype={
        contentType:file.type,
    }
    const uploadTask=await uploadBytes(storageRef,file,metatype);
    const postURL=await getDownloadURL(storageRef);
    const time=serverTimestamp();
    await setDoc(newPostRef,{
        uid:body.uid,
        latitude:body.lati,
        longitude:body.long,
        url:postURL,
        text:body.text,
        category:body.category,
        timestamp:time,
        title:body.title,
        address:body.address,
        id:newPostRef.id
    })
    await setDoc(doc(db,"spots",`${newPostRef.id}`),{
        latitude:body.lati,
        longitude:body.long,
        category:body.category,
        uid:body.uid,
        timestamp:time,
        id:newPostRef.id
    })
    return newPostRef.id;
}

async function getPostByLocation(lati,long){
    const collectionRef=collection(db,"posts");
    const q=query(collectionRef,where("latitude","==",lati),where("longitude","==",long));
    const snapshot=await getDocs(q);
    const results = snapshot.docs.map((doc)=>(doc.data()));
    return results
}
async function getAllPosts(){
    const q=query(collection(db,"posts"));
    const snapshot=await getDocs(q);
    const data = snapshot.docs.map((doc)=>(doc.data()));
    const id= snapshot.docs.map((doc)=>(doc.id));
    const results={data:data,id:id};
    return results;
}
async function getPostByUid(uid){
    const collectionRef=collection(db,"posts");
    const q=query(collectionRef,where("uid","==",uid));
    const snapshot=await getDocs(q);
    const results = snapshot.docs.map((doc)=>(doc.data()));
    return results;
}
//spots
async function getAllSpots(){
    const q=query(collection(db,"spots"));
    const snapshot=await getDocs(q);
    const results = snapshot.docs.map((doc)=>(doc.data()));
    return results;
}
async function getSpotByLocation(lati,long){
    const collectionRef=collection(db,"spots");
    const q=query(collectionRef,where("latitude","==",lati),where("longitude","==",long));
    const snapshot=await getDocs(q);
    const results = snapshot.docs.map((doc)=>(doc.data()));

    return results;
}
async function getSpotByCategory(category){
    const collectionRef=collection(db,"spots");
    const q=query(collectionRef,where("category","==",category));
    const snapshot=await getDocs(q);
    const results = snapshot.docs.map((doc)=>(doc.data()));

    return results;
}
async function getSpotByUid(uid){
    const collectionRef=collection(db,"spots");
    const q=query(collectionRef,where("uid","==",uid));
    const snapshot=await getDocs(q);
    const results = snapshot.docs.map((doc)=>(doc.data()));

    return results;
}
//google sign in and set profile 
function googleSignIn(){
    return signInWithPopup(auth,provider);
}

async function getAllCategory(){
    const docRef=doc(db,"category","all");
    const docSnap=await getDoc(docRef);
    return docSnap.data();
}

async function handleSignIn(){
    googleSignIn()
    .then((result)=>{
       return result.user;
    })
    .then((user)=>{
        getProfile(user.uid)
        .then((res)=>{
            if(!res){
                setProfile(user.uid,user.displayName,user.email,user.photoURL)
                .then(()=>{})
                .catch((err)=>{
                    console.log(err.message);
                }) 
            }
        })
        .catch(()=>{
            console.log('err');
        })
    })
    .catch((err)=>{
        console.log(err.message);
    })
}
//follow
async function followByUid(myemail,myuid,uid){
    const Ref=doc(db,"profile",`${myuid}`);
    await updateDoc(Ref,{
        follow:arrayUnion(uid)
    })
    const docRef=doc(db,"profile",`${uid}`);
    await updateDoc(docRef,{
        followedByUid:arrayUnion(myuid),
        followedByEmail:arrayUnion(myemail),
    })
}
async function unfollowByUid(myemail,myuid,uid){
    const Ref=doc(db,"profile",`${myuid}`);
    await updateDoc(Ref,{
        follow:arrayRemove(uid)
    })
    const docRef=doc(db,"profile",`${uid}`);
    await updateDoc(docRef,{
        followedByUid:arrayRemove(myuid),
        followedByEmail:arrayRemove(myemail),
    })
}
async function getMyfollow(uid){
    const docRef=doc(db,"profile",`${uid}`);
    const docSnap=await getDoc(docRef);
}
//post notify send-email
async function newPostNotify(uid,name,title){
    const docRef=doc(db,"profile",`${uid}`);
    const docSnap=await getDoc(docRef);
    const mailRef=doc(collection(db,"mail"));
    await setDoc(mailRef,{
        to:docSnap.data().followedByEmail,
        message:{
            subject:`您追蹤的 ${name} 剛剛發佈了新文章`,
            text:`${name} 新增了一則關於 ${title} 的食記`,
            html:`<div>${name} 新增了一則關於 ${title} 的食記</div><div>快到<a href="${window.location.origin}/">weEat</a>上查看吧</div>`
        },
    })
}

export{
    getAllSpots,
    getSpotByLocation,
    getSpotByCategory,
    getSpotByUid,
    setPost,
    getPostByLocation,
    getProfile,
    setProfile,
    updateProfile,
    updateProfileURL,
    signup,
    login,
    logout,
    useAuth,
    googleSignIn,
    getAllCategory,
    getAllPosts,
    setMySavePost,
    rmMySavePost,
    getMySavePost,
    handleSignIn,
    followByUid,
    unfollowByUid,
    newPostNotify,
    getPostByUid,
}