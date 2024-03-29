import L from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl} from "react-leaflet";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
import coffee from "../assets/coffee.png";
import drink from "../assets/drink.png";
import ramen from "../assets/ramen.png";
import hotpot from "../assets/hot-pot.png";
import cake from "../assets/cake.png";
import close from "../assets/close-button.png";
import pin from "../assets/pin.png";
import Save from "../assets/save2.png";
import gps from "../assets/gps.png";
import others from "../assets/others.png";
import signin from "../assets/signin.jpeg";
import home from "../assets/home.png";
import "../pages/Map.css";
import { Link } from "react-router-dom";
import { getAllPosts, setMySavePost, useAuth, logout, getProfile, handleSignIn, followByUid, unfollowByUid } from "../utils/firebase";
import { useSelector, useDispatch } from "react-redux";
import { setFlyto, offFlyto } from "../reducers/flyto";
import { setPosition, initPosition } from "../reducers/position";
import Swal from "sweetalert2";
import NoiSearch from "../components/NoiSearch";
import styled from "styled-components";
import exit from "../assets/log-out.png";
import NewPost from "../components/NewPost";
import newpostbtn from "../assets/more.png";
import follow from "../assets/follow.png";
import unfollow from "../assets/unfollow.png";
import fun from "../assets/fun.png";
import { ToggleButtonGroup, ToggleButton, createTheme, ThemeProvider, Tooltip } from "@mui/material";
//&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors
//"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

const theme = createTheme({
    palette: {
      primary: {
        main: '#629C1B',
      },
      secondary: {
        main: '#F17427',
      },
    },
  });

const LogOutButton=styled.img`
    width: 45px;
    height: 45px;
    position: fixed;
    bottom: 200px;
    right: 20px;
    z-index: 99;
    cursor: pointer;
    object-fit: cover;
    border-radius: 5%;
    @media screen and (max-width:750px) {
        position: fixed;
        bottom: 305px;
        right: 10px;
    }
`
const LogOutInfo=styled.div`
    width: 80px;
    height: 30px;
    position: fixed;
    bottom: 210px;
    right: 75px;
    z-index: 99;
    opacity: 0.5;
    background-color:#0B3E79;
    border-radius: 5%;
    color: antiquewhite;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    ${ props => (props.show? '':'display:none')};
    @media screen and (max-width:750px) {
        position: fixed;
        bottom: 305px;
        right: 65px;
    }
`
const ShowPost=styled.div`
    width: 100%;
    height: 100%;
    z-index: 200;
    position: fixed;
    top: 0;
    right: 0;
    background-color: rgba(23, 27, 27, 0.93);
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: scroll;
`
const CloseButton=styled.img`
    width: 50px;
    height: 50px;
    opacity: 0.9;
    cursor: pointer;
    object-fit: cover;
    background-color:#0B3E79;
    border-radius: 50%;
    position: absolute;
    right: 10px;
    top:10px;
` 
const PostWrapper=styled.div`
    opacity: 1;
    width: 80%;
    height: 750px;
    color:white;
    z-index: 200;
`
const InfoWrapper=styled.div`
    width: 100%;
    height: 90px;
    display: flex;
    position: relative;
    top:0;
    left: 0;
    @media screen and (min-width: 1500px){
        position: relative;
        top:0;
        left: 100px;
    }
`
const AuthorImage=styled.img`
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 50%;
    border: 0px;
    position: relative;
    top:20px;
    left: 20px;
    @media screen and (min-width: 1500px){
        position: relative;
        top:20px;
        left: 100px;
    }
`
const AuthorName=styled.div`
    width: 200px;
    height: 60px;
    font-size: 30px;
    font-weight: bold;
    color: antiquewhite;
    margin-left: 50px;
    margin-top: 40px;
    @media screen and (min-width: 1500px){
       
        margin-top: 50px;
        margin-left: 150px;
        z-index: 200;
    }
`
const PostDate=styled.div`
    width: 300px;
    height: 60px;
    font-size: 25px;
    font-weight: 900;
    color: antiquewhite;
    position: relative;
    left: 300px;
    top:41px;
    @media screen and (min-width: 1500px){
        position: relative;
        top:41px;
        left: 190px;
    }
`
const PostImage=styled.img`
    width: 800px;
    height: 600px;
    object-fit: cover;
    background-color: aqua;
    position: relative;
    left: 80px;
    top:50px;
    @media screen and (min-width: 1500px){
        position: relative;
        top:50px;
        left: 180px;
    }
`
const PostText=styled.div`
    width: 770px;
    height: 130px;
    position: relative;
    left: 80px;
    top:70px;
    font-size: 20px;
    letter-spacing: 1.5px;
    background-color: white;
    color: black;
    padding: 15px;
    text-align: center;
    overflow-y: scroll;
    @media screen and (min-width: 1500px){
        position: relative;
        top:70px;
        left: 180px;
    }
`

const PostTitle=styled.div`
    writing-mode: vertical-rl;
    width: 50px;
    height: 400px;
    font-size: 40px;
    letter-spacing: 4px;
    position: absolute;
    top:30%;
    right: 20%;
    @media screen and (min-width: 1500px){
        position: absolute;
        top:30%;
        right: 25%;
    }
`
const PostAddress=styled.div`
    width: 800px;
    background-color: white;
    height: 80px;
    color: black;
    font-size: 20px;
    letter-spacing: 1.5px;
    text-align: center;
    position: relative;
    top:90px;
    left: 81px;
    padding-bottom: 20px;
    @media screen and (min-width: 1500px){
        position: relative;
        top:90px;
        left: 181px;
    }
`
const PinImage=styled.img`
    margin-top: 20px;
    width: 40px;
    height: 40px;
    object-fit: cover;
`
const LinkAddress=styled.a`

    text-decoration: none;
    color: black;
    font-size: 20px;
    letter-spacing: 1.5px;
    text-align: center;
    cursor: pointer;
`
const NoteAddress=styled.div`
    font-size: 15px;
    color:#EE710B;
    ${ props => (props.show? '':'display:none')};
`
const SaveButton=styled.img`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 0px;
    box-shadow: rgb(208 208 208) 0px 0px;
    cursor: pointer;

    position: absolute;
    top:10%;
    right: 10px;
    z-index: 200;
`
const GpsButton=styled.img`
    width: 50px;
    height: 48px;
    position: fixed;
    bottom: 320px;
    right: 20px;
    z-index: 99;
    opacity: 1;
    cursor: pointer;
    object-fit: cover;
    border-radius: 20%;
    @media screen and (max-width:750px) {
        position: fixed;
        bottom: 180px;
        right: 10px;
    }
`
const GpsInfo=styled.div`
    width: 80px;
    height: 30px;
    position: fixed;
    bottom: 330px;
    right: 75px;
    z-index: 99;
    opacity: 0.5;
    letter-spacing: 2px;
    background-color:#0B3E79;
    border-radius: 5%;
    color: antiquewhite;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    ${ props => (props.show? '':'display:none')};
    @media screen and (max-width:750px) {
        position: fixed;
        bottom: 190px;
        right: 65px;
    }
`

const NewPostButton=styled.img`
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 260px;
    right: 20px;
    z-index: 101;
    cursor: pointer;
    object-fit: cover;
    border-radius: 20%;
    @media screen and (max-width:750px) {
        position: fixed;
        bottom: 120px;
        right: 10px;
    }
`
const NewPostInfo=styled.div`
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
    @media screen and (max-width:750px) {
        position: fixed;
        bottom: 130px;
        right: 65px;
    }
`
const HomeButton=styled.img`
    width: 50px;
    height: 50px; 
    z-index: 101;
    opacity: 1;
    cursor: pointer;
    object-fit: cover;
    border-radius: 20%;
`
const HomeLink=styled(Link)`
    width: 50px;
    height: 50px;
    position: fixed;
    bottom: 380px;
    right: 20px;
    z-index: 101;
    @media screen and (max-width:750px) {
        position: fixed;
        bottom: 240px;
        right: 10px;
    }
`
const MenuWrapper=styled.div`
    width: 390px;
    height: 49px;
    background-color: rgb(239 248 248 / 92%);
    z-index: 101;
    border-radius: 2px;
    border: 0px;
    position:absolute;
    top:10px;
    left:5px;
    @media screen and (max-width:750px){
        width: 318px;
        height: 40px;
        position: fixed;
        bottom:30px;
        left: 20px;
        top:auto;

    }
`
const FollowButton=styled.img`
    width: 50px;
    height: 50px;
    border-radius: 5px;
    border: 0px;
    box-shadow: rgb(208 208 208) 0px 0px;
    cursor: pointer;
    position: absolute;
    top:18%;
    right: 10px;
    z-index: 200;

`

function Map() {
    const currentUser=useAuth();
    const iconURL=[coffee,drink,ramen,hotpot,cake,others];
    const [allPosts,setAllPosts]=useState([]);
    const [map,setMap]=useState();
    const [zoom,setZoom]=useState(8.2);
    const [filterPost,setFilterPost]=useState([]);
    const [filter,setFilter]=useState(false);
    const [showPost,setShowPost]=useState(false);
    const [showMapNote,setShowMapNote]=useState(false);
    const [selectedOption,setSelectedOption]=useState('');
    const [logoutShow,setLogOutShow]=useState(false);
    const [authorImg,setAuthorImg]=useState('');
    const [authorName,setAuthorName]=useState('');
    const [postInfo,setPostInfo]=useState();
    const [postTime,setPostTime]=useState();
    const [showGpsInfo,setShowGpsInfo]=useState(false);
    const [showNewPostInfo,setShowNewPostInfo]=useState(false);
    const position=useSelector((state)=>state.position.value);
    const flyto=useSelector((state)=>state.flyto.value);
    const dispatch=useDispatch();
    const [gpsloading,setGpsloading]=useState(false);
    const [myfollow,setMyfollow]=useState([]);

    const [reSetfollow,setReSetFollow]=useState(false);

    //===RWD===;; ===initial state is laptop===
    const [device,setDevice]=useState(true);
    useEffect(()=>{
        if(window.innerWidth<750){
            setDevice(false);
        }
    },[])
    useEffect(()=>{
        if(flyto && position && map){
            map.flyTo([position.lat,position.lng],15,{
                duration:1,
            })
            dispatch(offFlyto());
        }
    },[flyto])
    useEffect(()=>{
        getAllPosts()
        .then((res)=>{
            setAllPosts(res.data);
        })
    },[])
    useEffect(()=>{
        if(currentUser){
            setMyfollow([]);
            getProfile(currentUser.uid)
            .then((res)=>{
                if(res.follow){
                    setMyfollow(res.follow);
                }
            })
        }
    },[currentUser])
    useEffect(()=>{
        if(currentUser){
            setMyfollow([]);
            getProfile(currentUser.uid)
            .then((res)=>{
                if(res.follow){
                    setMyfollow(res.follow);
                }
            })
        }
    },[reSetfollow])
    async function successGPS(position){
        const lat=position.coords.latitude;
        const lng=position.coords.longitude;
        //===GPS only available in TAIWAN===
        if( lat>26 || lat < 19 || lng >122 || lng <120 ){
            window.alert('GPS only available in TAIWAN');
            return;
        }
        const center={lat:lat,lng:lng};
        setGpsloading(false);
        dispatch(setPosition(center));
        setZoom(17);
        dispatch(setFlyto(true));
    }
    async function errorGPS(){
        const center={lat:23.697809,lng:120.960518};
        setGpsloading(false);
        window.alert('請開啟定位功能');
        dispatch(setPosition(center));
    }
    async function getLocation(){
        if(navigator.geolocation){
            setGpsloading(true);
            navigator.geolocation.getCurrentPosition(successGPS,errorGPS);
        }
        else{
            const center={lat:23.697809,lng:120.960518};
            dispatch(setPosition(center));
            window.alert('your device does not provide the gps');
        }
    }
    const Geolocation=async ()=>{
        await getLocation();
            
    }
    useEffect(()=>{
        if(gpsloading){
            Swal.fire({
                title: '定位中',
                text:'請稍等...',
                width: 800,
                color: 'rgba(27, 33, 29, 0.72)',
                confirmButtonText: 'Ok',
                confirmButtonColor: 'rgba(254, 169, 220, 0.99)',
                backdrop: `
                    rgba(54, 66, 83, 0.9)
                `,
                imageUrl: `${fun}`,
                imageWidth: 600,
                imageHeight: 400,
                imageAlt: 'Custom image',
                background: 'rgba(254, 240, 248, 0.99)'
            })
        }
    },[gpsloading])
    const t1=L.latLng(19,120);
    const t2=L.latLng(26,122);
    const bounds=L.latLngBounds(t1,t2);
    function getIcon(category){
        let categoryNum;
        switch(category){
            case 'Coffee':
                categoryNum=0;
                break;
            case 'Drink':
                categoryNum=1;
                break;
            case 'Ramen':
                categoryNum=2;
                break;
            case 'Hot pot':
                categoryNum=3;
                break;
            case 'Dessert':
                categoryNum=4;
                break;
            default:
                categoryNum=5;
        }
        return L.icon({
        iconUrl:iconURL[categoryNum],
        iconSize:40,
        })
    }
    const handleSave=async (id)=>{
        if(!currentUser){
            Swal.fire({
                title: '請先登入',
                width: 500,
                color: 'rgba(27, 33, 29, 0.72)',
                icon: 'error',
                confirmButtonColor: 'rgba(18, 190, 78, 0.7)',
                backdrop: `
                rgba(54, 66, 83, 0.98)
                `
            })
            return;
        }
        setMySavePost(currentUser.uid,id)
        .then((res)=>{
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: '已加入個人地圖',
                showConfirmButton: false,
                timer: 1200
            })
        })
        .catch((err)=>{
            console.log(err.message);
        })
    }
    const SelectByCategory=(category)=>{
        if(category==='All'){
            setFilter(false);
            return;
        }
        const post=allPosts.filter((p)=>{
            return p.category===`${category}`;
        })
        setFilter(true);
        setFilterPost(post);
    }
    useEffect(()=>{
        if(selectedOption){
            SelectByCategory(selectedOption);
        }
    },[selectedOption])
    const handlelogout=()=>{
        logout()
        .then((res)=>{
            navigator('/');
        })
    }
    const handleShowPost=async (post)=>{
        getProfile(post.uid)
        .then((res)=>{
            setAuthorImg(res.photoURL);
            setAuthorName(res.name);
            setPostInfo(post);
            setPostTime(JSON.parse(JSON.stringify(post.timestamp.toDate().toLocaleString())));
            setShowPost(true);
        })
    }
    const handleGoSignIn=()=>{
        Swal.fire({
            title: 'SIGN IN',
            text:'Sign In with Google to Continue...',
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
                    console.log('signin succ');
                })
            }
        })
    }
    const handleFollow=async (uid)=>{
        if(!currentUser){
            alert('請先登入');
            return;
        }
        if(currentUser.uid===uid){
            alert('不能追蹤自己唷');
            return;
        }
        followByUid(currentUser.email,currentUser.uid,uid)
        .then(()=>{
            setReSetFollow(!reSetfollow);
            Swal.fire({
                title: '已追蹤',width: 500,
                color: 'rgba(27, 33, 29, 0.72)',
                icon: 'success',
                confirmButtonColor: 'rgba(18, 190, 78, 0.65)',
                backdrop: `rgba(54, 66, 83, 0.9)`
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    const handleUnFollow=async (uid)=>{
        if(!currentUser){
            alert('請先登入');
            return;
        }
        if(currentUser.uid===uid){
            alert('不能退追自己唷');
            return;
        }
        unfollowByUid(currentUser.email,currentUser.uid,uid)
        .then(()=>{
            setReSetFollow(!reSetfollow);
            Swal.fire({
                title: '已退追',width: 500,
                color: 'rgba(27, 33, 29, 0.72)',
                icon: 'success',
                confirmButtonColor: 'rgba(18, 190, 78, 0.65)',
                backdrop: `rgba(54, 66, 83, 0.9)`
            })
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    function isFollowed(id){
        let temp=0;
        if(myfollow.length===0){
            return temp;
        }
        myfollow.map((f)=>{
            if(f===id){
                temp=1;
            }
        })
        return temp;
    }
    return (
        <div className="map_wrapper">
            { currentUser ? <NewPost /> :<NewPostButton src={newpostbtn}  onClick={()=>handleGoSignIn()} onMouseOver={()=>setShowNewPostInfo(true)} onMouseOut={()=>setShowNewPostInfo(false)}/>} 
            <NewPostInfo show={showNewPostInfo}>Post</NewPostInfo>
            <HomeLink to='/' ><HomeButton src={home} /></HomeLink>
            <NoiSearch />
            {showPost &&
            <ShowPost>
                <CloseButton src={close} onClick={()=>setShowPost(false) } />
                { currentUser && <Tooltip title="加入個人地圖" placement="left-end">
                <SaveButton src={Save}  onClick={()=>handleSave(postInfo.id)} />
                </Tooltip>}
                {currentUser &&  currentUser.uid!==postInfo.uid && (isFollowed(postInfo.uid)===1 ?
                <Tooltip title="取消追蹤用戶" placement="left-end" onClick={()=>handleUnFollow(postInfo.uid)}>
                <FollowButton src={unfollow} />
                </Tooltip>:
                <Tooltip title="追蹤用戶 獲取貼文通知" placement="left-end" onClick={()=>handleFollow(postInfo.uid)}>
                    <FollowButton src={follow} />
                </Tooltip>)}
                <PostWrapper>
                    <InfoWrapper>
                    <AuthorImage src={authorImg} />
                    <AuthorName>{authorName}</AuthorName>
                    <PostDate>{postTime}</PostDate>
                    </InfoWrapper>
                    <PostImage src={postInfo.url} />
                    <PostTitle>
                        {postInfo.title}
                    </PostTitle>
                    <PostText>
                        {postInfo.text}
                    </PostText>
                    <PostAddress>
                        <PinImage src={pin} />
                        <LinkAddress href={`https://www.google.com/maps/search/?api=1&query=${postInfo.latitude},${postInfo.longitude}`} target="_blank" rel="noopener noreferrer" onMouseOver={()=>setShowMapNote(true)} onMouseOut={()=>setShowMapNote(false)}>{postInfo.address}</LinkAddress>
                        <NoteAddress show={showMapNote}>在地圖上開啟</NoteAddress>
                    </PostAddress>
                </PostWrapper>
            </ShowPost>}
            { currentUser && <LogOutButton src={exit} onMouseOver={()=>setLogOutShow(true)} onMouseOut={()=>setLogOutShow(false)} onClick={()=>handlelogout()}></LogOutButton>}
            { currentUser && <LogOutInfo show={logoutShow}>Log Out</LogOutInfo>}
            <GpsButton src={gps} onMouseOver={()=>setShowGpsInfo(true)} onMouseOut={()=>setShowGpsInfo(false)} onClick={()=>Geolocation()}/>
            <GpsInfo show={showGpsInfo}>定位</GpsInfo>
            <MenuWrapper>
            <ThemeProvider theme={theme}>
            <ToggleButtonGroup color="secondary" exclusive value={selectedOption} onChange={(e)=>setSelectedOption(e.target.value)} style={{zIndex:'101'}} size={device ? 'medium':'small'} >
                <ToggleButton value="All" color="primary">All</ToggleButton>
                <ToggleButton value="Coffee">咖啡廳</ToggleButton>
                <ToggleButton value="Drink">手搖飲</ToggleButton>
                <ToggleButton value="Ramen">拉麵</ToggleButton>
                <ToggleButton value="Hot pot">火鍋</ToggleButton>
                <ToggleButton value="Dessert">甜點</ToggleButton>
                <ToggleButton value="Others">其他</ToggleButton>
            </ToggleButtonGroup>
            </ThemeProvider>
            </MenuWrapper>
        {<MapContainer center={[position.lat,position.lng]} zoom={zoom}  minZoom={8} maxBounds={bounds} attributionControl={true} maxZoom={18} whenReady={(map)=>(setMap(map.target))} zoomControl={false}>
            <TileLayer
        attribution="© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>"
        url={`${process.env.REACT_APP_MAPURL}`}
         />
        <ZoomControl position="bottomright"  />
        { (allPosts) && filter ?
        filterPost.map((s,i)=>{
            return (
                <Marker position={[s.latitude,s.longitude]}  key={i} icon={getIcon(s.category)}>
                    <Popup>
                        <img src={s.url} style={{width:'250px',height:'200px',border:'1px solid rgba(233, 236, 234, 0.28)',borderRadius:'8px',cursor:'pointer'}} onClick={()=>handleShowPost(s)}></img>
                        <div style={{fontSize:'19px',letterSpacing:'3px'}}>{s.title}</div>
                    </Popup>
                </Marker>
            )
        })
        :
        allPosts.map((s,i)=>{
            return (
                <Marker position={[s.latitude,s.longitude]}  key={i} icon={getIcon(s.category)}>
                    <Popup>
                        <img src={s.url} style={{width:'250px',height:'200px',border:'1px solid rgba(233, 236, 234, 0.28)',borderRadius:'8px',cursor:'pointer'}} onClick={()=>handleShowPost(s)}></img>
                        <div style={{fontSize:'19px',letterSpacing:'3px'}}>{s.title}</div>
                    </Popup>
                </Marker>
            )
        })
        }
        </MapContainer>}
        </div>
    );
}
export default Map;
