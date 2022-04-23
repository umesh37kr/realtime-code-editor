import React, { useState } from "react";
import {v4 as uuidV4} from 'uuid';
import toast from 'react-hot-toast'
import { useNavigate } from "react-router-dom";
const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [userName, setUserName] = useState('');

    const createNewRoom = (e) =>{
        e.preventDefault()
        const id = uuidV4()
        setRoomId(id)
        toast.success('created a new room')

    }
    const joinRoom = () => {
        console.log(`username ${userName} and room id ${roomId} from home 18`)
        if(!userName || !roomId){
            toast.error("roomId and username is required")
            return
        }
        // redirect
        navigate(`/editor/${roomId}`,{
            state:{
                userName
            }
        })
    }

    //join room on pressing Enter button
    const handleInputEnter = (e) =>{
        if(e.code === 'Enter'){
            joinRoom()
        }
    }
    return(
        <div className="homePageWrapper">
            <div className="formWrapper">
                <img className="homePageLogo" src="/code-sync.png" alt="code-sync-logo"/>
                <h4 className="mainLabel">Paste Invitation Room Id</h4>
                <div className="inputGroup">
                    <input 
                        type="text" 
                        className="inputBox" 
                        onChange={(e) => setRoomId(e.target.value)} 
                        value={roomId} 
                        placeholder="ROOM ID"
                        onKeyUp={handleInputEnter}
                    />
                    <input 
                        type="text" 
                        className="inputBox" 
                        onChange={(e) => setUserName(e.target.value)} 
                        value={userName}
                        onKeyUp={handleInputEnter} 
                        placeholder="USERNAME"
                    />
                    <button onClick={joinRoom} className="btn joinBtn">Join</button>
                    <span className="createInfo">
                        If you don't have invite then create &nbsp;
                        <a onClick={createNewRoom} href="" className="createNewBtn">new room</a> 
                    </span>
                </div>
            </div>
            <footer>
                <h4>Build with love by umesh <a href="#">umesh kumar</a></h4>
            </footer>
        </div>
    )
}

export default Home;