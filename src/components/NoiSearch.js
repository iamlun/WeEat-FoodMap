import { useState } from "react";
import styled from "styled-components";
import search from "../assets/search.png";
import { useSelector, useDispatch } from "react-redux";
import { setLat, setLng, setPosition } from "../reducers/position";
import { setFlyto } from "../reducers/flyto";
const Wrapper=styled.div`
    height: 180px;
    width: 260px;
    position: fixed;
    top: 20px;
    right: 100px;
    z-index: 99;
    display: flex;
    
    justify-content: center;
    align-items: center;
   
`
const SearchWrapper=styled.div`
    height: 40px;
    width: 250px;
    position: fixed;
    top: 20px;
    right: 100px;
    z-index: 99;
    display: flex;
    background-color:white;
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    border: 2px solid rgba(238, 241, 241, 0.78);
    opacity: 0.85;
`
const AddInput=styled.input`
    width: 210px;
    height: 32px;
    border-radius: 20px;
    border: 0.2px solid white;
    font-size: 18px;
    text-align: center;
    letter-spacing: 1px;
`
const SearchBtn=styled.img`
    width: 32px;
    height: 32px;
    object-fit: cover;
    cursor: pointer;
`
const ListWrapper=styled.div`
    width: 250px;
    height: 120px;
    position: fixed;
    top:64px;
    right: 100px;
    overflow: scroll;
    /* background-color: white; */
    justify-content: center;
    align-items: center;
    border-radius: 20px;
    border-top: 0;
    opacity: 0.86;
    
`
const ListItem=styled.div`
    height: 30px;
    width: 240px;
    font-size: 16px;
    background-color: rgba(221, 247, 247, 0.93);
    border-radius: 20px;
    border: 0px;
    overflow-y: scroll;
    text-align: center;
    padding-top: 5px;
    cursor: pointer;
    &:hover{
        background-color: rgba(97, 187, 186, 0.84);
    }
`

const NoiSearch = () => {
    const [add,setAdd]=useState('');
    const [searchList,setSearchList]=useState([]);
    const [showList,setShowList]=useState(false);
    const position=useSelector((state)=>state.position.value);
    const dispatch=useDispatch();
    const handleSearch=async ()=>{
        if(!add){
            console.log('please input the address');
        }
        const params = {
            q: add,
            format: "json",
            addressdetails: 1,
            polygon_geojson: 0,
          };
        const queryString = new URLSearchParams(params).toString();
          const requestOptions = {
            method: "GET",
            redirect: "follow",
          };
          fetch(`https://nominatim.openstreetmap.org/search?${queryString}`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            setSearchList(JSON.parse(result));
            setShowList(true);
          })
          .catch((err) =>{
            console.log("err: ", err);
          });
    }
    const handleClick=(lat,lng)=>{
        dispatch(setPosition({lat:lat,lng:lng}));
        dispatch(setFlyto(true));
        setShowList(false);
    }

    return (
        <Wrapper>
        <SearchWrapper>
            <AddInput placeholder="Tainan" value={add} onChange={(e)=>setAdd(e.target.value)}>
            </AddInput>
            <SearchBtn src={search} onClick={()=>handleSearch()}></SearchBtn>
        </SearchWrapper>
        { showList && <ListWrapper>
            {searchList.map((item,i)=>{
                return <ListItem key={i} onClick={()=>handleClick(item.lat,item.lon)}>{item.display_name}</ListItem>
            })}
        </ListWrapper>}
        </Wrapper>
    );
}
 
export default NoiSearch;