import {useEffect, useState, useRef, use, useContext} from "react";
import { io, Socket } from "socket.io-client";
import { debounce } from "lodash";
import {
  TextOperationSetWithCursor,
  createTextOpFromTexts,
} from "../../../utils/shared-ot";
import { TextOp } from "ot-text-unicode";
import { Room, connect } from "twilio-video";
import {collaborationSocketAddress} from "@/gateway-address/gateway-address";
import {AuthContext} from "@/contexts/AuthContext";

type UseCollaborationProps = {
  roomId: string;
  userId: string;
  disableVideo?: boolean;
};

enum SocketEvents {
  ROOM_JOIN = "api/collaboration-service/room/join",
  ROOM_UPDATE = "api/collaboration-service/room/update",
  ROOM_SAVE = "api/collaboration-service/room/save",
  ROOM_LOAD = "api/collaboration-service/room/load",
  QUESTION_SET = "api/collaboration-service/question/set",
}

var vers = 0;

const useCollaboration = ({ roomId, userId, disableVideo }: UseCollaborationProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [text, setText] = useState<string>("#Write your solution here");
  const [cursor, setCursor] = useState<number>(
    "#Write your solution here".length
  );
  const [room, setRoom] = useState<Room | null>(null); // twilio room
  const textRef = useRef<string>(text);
  const cursorRef = useRef<number>(cursor);
  const prevCursorRef = useRef<number>(cursor);
  const prevTextRef = useRef<string>(text);
  const awaitingAck = useRef<boolean>(false); // ack from sending update
  const awaitingSync = useRef<boolean>(false); // synced with server
  const twilioTokenRef = useRef<string>("");
  const questionId = "1";
  const { user: currentUser, authIsReady } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      currentUser.getIdToken(true).then(
        (token) => {
          const socketConnection = io(collaborationSocketAddress, {
            extraHeaders: {
              "User-Id-Token": token
            },
            path: "/collaboration/socket.io"
          });
          setSocket(socketConnection);

          socketConnection.emit(SocketEvents.ROOM_JOIN, roomId, userId);
          socketConnection.emit(SocketEvents.QUESTION_SET, questionId);

          socketConnection.on("twilio-token", (token: string) => {
            twilioTokenRef.current = token;
            if (disableVideo) return;
            connect(token, {
              name: roomId, audio: true,
              video: {width: 640, height: 480, frameRate: 24}
            }).then((room) => {
              console.log("Connected to Room");
              setRoom(room);
            }).catch(err => {
              console.log(err, token, userId, roomId);
            });
          });

          socketConnection.on(
            SocketEvents.ROOM_UPDATE,
            ({
               version,
               text,
               cursor,
             }: {
              version: number;
              text: string;
              cursor: number | undefined | null;
            }) => {
              prevCursorRef.current = cursorRef.current;
              console.log("prevCursor: " + prevCursorRef.current);

              console.log("cursor: " + cursor);

              console.log("Update vers to " + version);
              vers = version;

              if (awaitingAck.current) return;

              textRef.current = text;
              prevTextRef.current = text;
              setText(text);
              if (cursor && cursor > -1) {
                console.log("Update cursor to " + cursor);
                cursorRef.current = cursor;
                setCursor(cursor);
              } else {
                cursorRef.current = prevCursorRef.current;
                cursor = prevCursorRef.current;
                console.log("Update cursor to " + prevCursorRef.current);
                setCursor(prevCursorRef.current);
              }
              awaitingSync.current = false;
            }
          );

          return () => {
            socketConnection.disconnect();
            if (room) {
              room.disconnect();
            }
          }
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, userId]);

  useEffect(() => {
    textRef.current = text;
  }, [text]);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  useEffect(() => {
    if (!socket) return;

    if (prevTextRef.current === textRef.current) return;

    if (awaitingAck.current || awaitingSync.current) return;

    awaitingAck.current = true;

    console.log("prevtext: " + prevTextRef.current);
    console.log("currenttext: " + textRef.current);
    console.log("version: " + vers);
    const textOp: TextOp = createTextOpFromTexts(
      prevTextRef.current,
      textRef.current
    );

    prevTextRef.current = textRef.current;

    console.log(textOp);

    const textOperationSet: TextOperationSetWithCursor = {
      version: vers,
      operations: textOp,
      cursor: cursorRef.current,
    };

    socket.emit(SocketEvents.ROOM_UPDATE, textOperationSet, () => {
      awaitingAck.current = false;
    });
  }, [text, socket]);

  return { text, setText, cursor, setCursor, room };
};

export default useCollaboration;
