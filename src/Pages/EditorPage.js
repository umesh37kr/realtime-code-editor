import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";
import Client from '../Components/Client'
import Editor from "../Components/Editor";
import { initSocket } from '../socket';
import  ACTIONS  from '../Action'

const EditorPage = () => {
    const socketRef = useRef(null);
    const codeRef = useRef(null);
    const location = useLocation();
    const { roomId } = useParams();
    const reactNavigator = useNavigate();
    const [clients, setClients] = useState([])
    useEffect(() =>{
        const init = async() =>{
            socketRef.current = await initSocket();
            socketRef.current.on('connection_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleErrors(e){
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.')
                reactNavigator('/')
            }
            socketRef.current.emit(ACTIONS.JOIN,{
                roomId,
                username:location.state?.userName,
            });
            // listening for joined events 
            socketRef.current.on(ACTIONS.JOINED, ({clients, username, socketId}) =>{
                // console.log("username from editorr page 33 "+username)
                if(username !== location.state?.username){
                    toast.success(`${username} joined the room.`)
                    console.log(`${username} joined the room`)
                }
                setClients(clients)
                socketRef.current.emit(ACTIONS.SYNC_CODE, {
                    code: codeRef.current,
                    socketId
                })
            })
            //Listening for disconnected

            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, username}) =>{
                toast.success(`${username} is left the room.`);
                setClients((pre) =>{
                    return pre.filter(
                        (client) => client.socketId !== socketId
                    )
                })
            })
        };
        init();
        return () =>{
            socketRef.current.disconnect();
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, []);

    async function copiedRoomId(){
        try {
           await navigator.clipboard.writeText(roomId)
            toast.success('Room Id has been copied to your clipboard')
        } catch (err) {
            toast.error("unable to copy Room Id")
            console.error(err)
        }
    }

    function leaveRoom(){
        reactNavigator('/')
    }

    if(!location.state){
        return <Navigate to="/"/>
    }
    return(
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img className="logoImg" src="/code-sync.png" alt="logo image" />
                    </div>
                    <h4>Connected</h4>
                    <div className="clientList">
                        {clients.map((client) =>(
                            <Client 
                            key={client.socket_id}
                            username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <button onClick={copiedRoomId} className="btn copyBtn">Copy Room Id</button>
                <button onClick={leaveRoom} className="btn leaveBtn">Leave</button>

            </div>
            <div className="editorWrap">
                <Editor 
                socketRef={socketRef} 
                roomId={roomId}
                onCodeChange={(code) =>{
                    codeRef.current = code;
                }}
                />
            </div>
        </div>
    )
}

export default EditorPage;