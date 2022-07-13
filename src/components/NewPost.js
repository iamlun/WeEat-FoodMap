import styled from "styled-components";
import React from "react";
import ReactDOM from "react-dom";
import plus from "../assets/more.png";
import close from "../assets/close-button.png";
import search from "../assets/search2.png";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getAllCategory, setPost, setMySavePost, useAuth, newPostNotify } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import preview from "../assets/photo.png";

const modalRoot = document.getElementById('modal-root');

const Wrapper=styled.div`
    height: 100vh;
    width: 100%;
    position: fixed;
    top: 0;
    right: 0;
    z-index:101;
    background-color:rgba(23, 27, 27, 0.23);
    display: flex;
    justify-content: center;
    align-items: center;

`
const PostButton=styled.img`
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 260px;
    right: 20px;
    z-index: 101;
    cursor: pointer;
    object-fit: cover;
    /* background-color: #82BBFB; */
    border-radius: 20%;
    &:hover {
        /* background-color: #0B3E79; */
    }
`
const PostInfo=styled.div`
    width: 80px;
    height: 30px;
    position: fixed;
    bottom: 270px;
    right: 75px;
    z-index: 101;
    opacity: 0.5;
    background-color:#0B3E79;
    border-radius: 5%;
    color: antiquewhite;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 19px;
    letter-spacing: 1px;
    ${ props => (props.show? '':'display:none')};
`
const CloseButton=styled.img`
    width: 50px;
    height: 50px;
    /* position: fixed;
    top:20px;
    right: 20px; */
    z-index: 200;
    opacity: 0.9;
    cursor: pointer;
    object-fit: cover;
    /* background-color:#0B3E79; */
    border-radius: 20%;
    position: absolute;
    right: 5px;
    top: 5px;
`
const PostWrapper=styled.div`
    width: 100%;
    height: 100vh;
    background-color:rgba(23, 27, 27, 0.83);
    z-index: 100;
    border: 0px;
    position: fixed;
    overflow-y: scroll;
    /* top: 50px; */
    /* justify-content: center;
    align-items: center; */
`
const SearchWrapper=styled.div`
    width: 324px;
    height: 50px;
    background-color: rgba(178, 216, 244, 0.97);
    border-radius: 8px;
    border: 1px solid rgba(178, 216, 244, 0.97);
    position: absolute;
    top: 0;
    right: 210px;
`
const SearchButton=styled.img`
    width: 35px;
    height: 35px;
    object-fit: cover;
    cursor: pointer;
    position: absolute;
    right: 5px;
    top: 5px;
`
const SearchInput=styled.input`
    width: 250px;
    height: 40px;
    position: absolute;
    top: 2px;
    left: 5px;
    font-size: 18px;
    color: rgba(106, 113, 122, 0.97);
    background-color: rgba(178, 216, 244, 0.97);
    border-radius: 8px;
    border: 1px solid rgba(178, 216, 244, 0.97);
    text-align: center;
    letter-spacing: 1px;
    overflow-x: scroll;
    
`
const NewPostWrapper=styled.div`
    width: 700px;
    height: 640px;
    /* background-color: rgba(11, 62, 121, 0.9); */
    z-index: 100;
    position: absolute;
    top: 55px;
    left: 25%;
    @media screen  and (min-width: 1500px){
        left: 30%;
    }
`
const ListWrapper=styled.div`
    width: 324px;
    height: 100px;
    background-color: rgba(178, 216, 244, 0.97);
    border-radius: 8px;
    /* border-top-left-radius:0px;
    border-top-right-radius:0px; */
    overflow-y: scroll;
    border-top: 0px;
    border: 1px solid rgba(178, 216, 244, 0.97);
    position: absolute;
    top: 51px;
    right: 210px;
    z-index: 200;
`
const ListItem=styled.div`
    width: 290px;
    height: 40px;
    font-size: 18px;
    overflow: scroll;
    padding-top: 4px;
    margin-top: 2px;
    text-align: center;
    cursor: pointer;
    color:rgba(106, 113, 122, 0.97) ;
    border: 1px solid rgba(168, 202, 249, 0.97);
    border-radius: 8px;
    z-index: 200;
     :hover{
      background-color: rgba(168, 202, 249, 0.97);
    }
`
const StoreInput=styled.input`
    width: 320px;
    height: 40px;
    position: absolute;
    top: 80px;
    right: 210px;
    font-size: 18px;
    color: rgba(106, 113, 122, 0.97);
    background-color: rgba(178, 216, 244, 0.97);
    border-radius: 8px;
    border: 1px solid rgba(178, 216, 244, 0.97);
    text-align: center;
    letter-spacing: 1px;

`
const CategorySelect=styled.select`
    margin: 0 auto;
    position: absolute;
    top:150px;
    right: 210px;
    text-align: center;
    color: rgba(106, 113, 122, 0.97);
    width: 325px;
    font-size: 18px;
    border-radius: 8px;
    border: 0px;
    height: 40px;
    cursor: pointer;
    z-index: 200;
    letter-spacing: 1px;
    background-color: rgba(178, 216, 244, 0.97);
    option{
        background-color: rgba(178, 216, 244, 0.97);
        color: rgba(106, 113, 122, 0.97);
        width: 310px;
        padding: 10px 15px;
        height: 20px;
    }
`
const CategoryOption=styled.option`
    background-color: white;
    color: #EC6F66;
    width: 310px;
    padding: 10px 15px;
    height: 20px;
    cursor: pointer;
    & :hover {
        padding-left: 25px;
        width: 270px;
        color: #EC6F66;
    }        
`
const UoloadButton=styled.label`
    width: 100px;
    height: 35px;
    text-align: center;
    padding-top: 3px;
    border: 0px;
    border-radius: 10px;
    background-color: rgba(178, 216, 244, 0.97);
    cursor: pointer;
    font-size: 18px;
    letter-spacing: 1px;
    color: rgba(106, 113, 122, 0.97);
    position: absolute;
    top:210px;
    right: 435px;    

`
const UploadImg=styled.img`
    width: 370px;
    height: 320px;
    position: absolute;
    top:270px;
    right: 160px;
    object-fit: cover;
    border: 0px ;
    border-radius: 0px;

`
const UploadInput=styled.input`
    display: none;
`
const TextInput=styled.textarea`
    width: 340px;
    height: 210px;
    position: absolute;
    top:630px;
    right: 180px;
    border: 0px;
    border-radius: 10px;
    font-size: 18px;
    letter-spacing: 2px;
    padding: 8px;
    background-color: rgba(178, 216, 244, 0.97);
        color: rgba(106, 113, 122, 0.97);    

`
const SendButton=styled.button`
    width: 150px;
    height:30px;
    position: absolute;
    top:870px;
    right: 180px;
    border: 0px;
    border-radius: 10px;
    font-size: 18px;
    letter-spacing: 3px;
    padding: 2px;
    /* padding-bottom: 10px; */
    margin-bottom: 60px;
    cursor: pointer;
    background-color: rgba(178, 216, 244, 0.97);
        color: rgba(106, 113, 122, 0.97);
`
const BottomPadding=styled.div`
    height: 50px;
    width: 320px;
    position: absolute;
    top:900px;
    right: 200px;
`

class Modal extends React.Component {
render() {
  return ReactDOM.createPortal(
    <Wrapper onClick={this.props.onClose}>
        {this.props.children}
    </Wrapper>,
    modalRoot
    
  )}
}
class NewPost extends React.Component{
state = {showModal: false, showInfo:false}
handleShowInfo= ()=>this.setState({showInfo:true})
handleCloseInfo= ()=>this.setState({showInfo:false})
handleShowMessageClick = () => this.setState({showModal: true})
handleCloseModal = () => this.setState({showModal: false})
render() {
  return (
    <React.Fragment>
        <PostButton src={plus} onClick={this.handleShowMessageClick} onMouseOver={this.handleShowInfo} onMouseOut={this.handleCloseInfo}></PostButton>
        <PostInfo show={this.state.showInfo}>Post</PostInfo>
        {this.state.showModal ? (
          <Modal >
            <PostWrapper>
              <CloseButton src={close} onClick={this.handleCloseModal}></CloseButton>
              <Post />
            </PostWrapper>
          </Modal >
        ) : null}
    </React.Fragment>
  )
}
}
const Post = () => {
    const [add,setAdd]=useState('');
    const [addList,setAddList]=useState([]);
    const [showList,setShowList]=useState(false);
    const [position,setPosition]=useState({lat:'',lng:''});
    const [title,setTitle]=useState('');
    const [category,setCategory]=useState('Coffee');
    const [file,setFile]=useState();  
    const imgUrl=file? URL.createObjectURL(file):preview;
    const [text,setText]=useState('');
    const navigate=useNavigate();
    const currentUser=useAuth();
    const [reload,setReload]=useState(false);
    const handleSearch=async ()=>{
        if(!add){
        Swal.fire(
            '請輸入地址','','warning'
        )
            return;
        }
        fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${add}&key=AIzaSyD4mvFMeEbc9KwGaEHKmIheWCeiW4nmCKU`,{
            method:'GET',
        }).then((res)=>{
            return res.json();
        }).then((data)=>{
            console.log(data.results);
            setAddList(data.results);
            setShowList(true);
        }).catch((err)=>{
            Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!'
            })
            console.log(err.message);
        })
    }
    const handleSetPosition=(lat,lng,add)=>{
        setPosition({lat:lat,lng:lng});
        setShowList(false);
        setAdd(add);
    }
    const handlePost=async ()=>{
        if(!currentUser){
            Swal.fire({
              title: '請先登入',
              width: 500,
              color: 'rgba(27, 33, 29, 0.72)',
              icon: 'error',
              confirmButtonColor: 'rgba(18, 190, 78, 0.65)',
              backdrop: `
              rgba(54, 66, 83, 0.9)
              `
            })
            return;
        }
        if(!file || !text || !category || !add || !position || !title){
            console.log(position);
          Swal.fire({
            title: '請確認資料填寫完整',
            width: 500,
            color: 'rgba(27, 33, 29, 0.72)',
            icon: 'error',
            confirmButtonColor: 'rgba(18, 190, 78, 0.65)',
            backdrop: `
            rgba(54, 66, 83, 0.9)
            `
          })
            return;
        }
        const body={
            uid:currentUser.uid,
            lati:position.lat,
            long:position.lng,
            text:text,
            category:category,
            title:title,
            address:add
        }

        setPost(body,file)
        .then((res)=>{
            setMySavePost(currentUser.uid,res)
                .then((res)=>{
                    newPostNotify(currentUser.uid,currentUser.displayName,title)
                    .then(()=>{
                        console.log('notify succ');
                        Swal.fire({
                            title: '上傳成功',width: 500,
                            color: 'rgba(27, 33, 29, 0.72)',
                            icon: 'success',
                            confirmButtonColor: 'rgba(18, 190, 78, 0.65)',
                            backdrop: `rgba(54, 66, 83, 0.9)`
                        })
                        .then(()=>{
                            setAdd('');
                            setPosition({lat:'',lng:''});
                            setTitle('');
                            setCategory('Coffee');
                            setFile();
                            setText('');
                            // navigate('/');
                            window.location.href="/";
                        })
                    })
                    .catch((err)=>{
                        console.log(err.message);
                    })
            })    
        })
    }

  return (
    <NewPostWrapper>
        <SearchWrapper>
          <SearchInput placeholder="請輸入地址" value={add} onChange={(e)=>setAdd(e.target.value)} showList={showList} />
            <SearchButton src={search} onClick={()=>handleSearch()} />
        </SearchWrapper>
        {showList &&
           <ListWrapper>
           { addList.length===0 ? 
              <ListItem>查無此地</ListItem>:
              addList.map((r,i)=>{
                return <ListItem key={i} onClick={()=>handleSetPosition(r.geometry.location.lat,r.geometry.location.lng,r.formatted_address)}>{r.formatted_address}</ListItem>
              })
           }
          </ListWrapper>     
        }
        <StoreInput value={title} onChange={(e)=>setTitle(e.target.value)} placeholder='請輸入店名' />
        <CategorySelect value={category} onChange={(e)=>setCategory(e.target.value)}>
              <CategoryOption disabled>選擇餐廳類別</CategoryOption>
              <CategoryOption value='Coffee'>咖啡廳</CategoryOption>
              <CategoryOption value='Drink'>手搖飲</CategoryOption>
              <CategoryOption value='Ramen'>拉麵</CategoryOption>
              <CategoryOption value='Hot pot'>火鍋</CategoryOption>
              <CategoryOption value='Dessert'>甜點</CategoryOption>
              <CategoryOption value='Others'>其他</CategoryOption>
        </CategorySelect>
        <UoloadButton htmlFor="post-img">上傳圖片</UoloadButton>
        <UploadImg src={imgUrl}/>
        <UploadInput type="file" accept="image/png, image/jpeg" id="post-img" onChange={(e)=>setFile(e.target.files[0])} />
        <TextInput rows="10" cols="60" value={text} onChange={(e)=>setText(e.target.value)} placeholder='請輸入餐廳評論'/>
        <SendButton onClick={()=> handlePost() }>上傳食記</SendButton>
        <BottomPadding />
    </NewPostWrapper>
  );
}

  
 
export default NewPost;

