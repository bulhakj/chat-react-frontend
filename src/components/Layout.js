import React from "react";
import socketIOClient from "socket.io-client";
import Message from "./Message";
import CurrentRoomInfo from "./CurrentRoomInfo";
import Emojis from "./Emojis";
import SendButton from "./SendButton";
import RoomsBar from "./RoomsBar";
import ConnectedUsers from "./ConnectedUsers";
import styled from "styled-components";
import { createGlobalStyle } from "styled-components";
import LogoImage from "../static/images/logo.svg";
import HamburgerMenuImage from "../static/images/hamburger-menu.svg";

const GlobalStyles = createGlobalStyle`
  body {
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Background = styled.div`
  height: 80.75vh;
  width: 93.75vw;
  display: flex;
  @media screen and (max-width: 576px) {
    height: 100%;
    width: 100%;
  }
`;

const LeftContainer = styled.section`
  width: 20%;
  border: 1px #fff solid;
  background-color: #2c2f33;
  border: none;
  border-radius: 15px 0 0 15px;
  @media screen and (max-width: 576px) {
    display: none;
  }
`;
const LeftHeader = styled.div`
  padding-left: 2.5rem;
  height: 3.2vw;
  display: flex;
  align-items: center;
  box-shadow: 0px 4px 11px -6px #000;
`;
const RoomHeader = styled.h3`
  color: #dadada;
  margin-top: 0;
  margin-bottom: 0;
  height: auto;
  font-weight: 400;
`;
const LeftContentWrapper = styled.div`
  color: #565656;
  text-transform: uppercase;
`;

const RoomsWrapper = styled.div`
  margin-top: 2vw;
`;

const CenterContainer = styled.section`
  width: 60%;
  background-color: #383c41;
  @media screen and (max-width: 576px) {
    width: 100%;
  }
`;
const CenterHeader = styled.div`
  height: 3.2vw;
  box-shadow: 0px 4px 11px -6px #000;
  background-color: #383c41;
  text-transform: uppercase;
  color: #dadada;
  font-weight: 400;
  display: flex;
  align-items: center;
  @media screen and (max-width: 576px) {
    height: 15vw;
    align-items: center;
  }
`;

const HamburgerMenuWrapper = styled.div`
  display: none;
  margin: 0 5vw;
  @media screen and (max-width: 576px) {
    display: inherit;
  }
`;

const HamburgerMenu = styled.img`
  display: none;
  @media screen and (max-width: 576px) {
    display: inherit;
  }
`;

const CenterContentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  height: calc(100% - 3em);
`;
const InputContainer = styled.div`
  height: 21%;
  width: 100%;
  margin-right: 1vw;
  margin-left: 1vw;
  display: flex;
  align-items: center;
  @media screen and (max-width: 576px) {
    margin-right: 3vw;
    margin-left: 3vw;
  }
`;
const InputWrapper = styled.div`
  width: 100%;
  background-color:#4D535B
  border-radius: 4px;
  height: 3vw;
  display: flex;
  align-items: center;
  @media screen and (max-width: 576px) {
    height: 2.8em;
  }
`;

const WritingInformationWrapper = styled.div`
  height: 9%;
  width: 100%;
  margin-right: 1vw;
  margin-left: 1vw;
  display: flex;
  align-items: flex-end;
`;

const WritingInformation = styled.p`
  margin-top: 0;
  margin-bottom: 0;
  font-size: 0.9rem;
  color: #9c9898;
  font-family: Roboto;
`;

const MessageWrapper = styled.div`
  width: 100%;
  height: 70%;
  overflow: auto;
`;
const SingleMessage = styled.div`
  padding: 1vw 1vw 0 1vw;
  @media screen and (max-width: 576px) {
    padding: 4vw 9vw 0 4vw;
  }
`;

const MessageAuthor = styled.div`
  font-size: 0.8rem;
  color: #c4c4c4;
  @media screen and (max-width: 576px) {
    margin-left: 2vw;
    margin-bottom: 0.8vw;
  }
`;

const MessageContent = styled.div`
  background-color: #414549;
  height: 2.5vw;
  border-radius: 14px;
  padding-left: 1vw;
  display: flex;
  align-items: center;
  margin-top: 0.2vw;
  color: #fbfbfb;
  @media screen and (max-width: 576px) {
    height: 2.3em;
    padding-left: 3vw;
  }
`;

const SvgWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  width: 10%;
`;
const RightContainer = styled.section`
  width: 20%;
  background-color: #2c2f33;
  border-radius: 0 15px 15px 0;
  @media screen and (max-width: 576px) {
    display: none;
  }
`;
const RightHeader = styled.div`
  height: 3.2vw;
  box-shadow: 0px 4px 11px -6px #000;
  background-color: #383c41;
  text-transform: uppercase;
  color: #dadada;
  border-radius: 0 15px 0 0;
`;
const LogoContainer = styled.div`
  height: 100%;
`;
const RightContentWrapper = styled.div`
  height: 100%;
`;
const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;
const Logo = styled.img`
  height: 2vw;
  padding-left: 0.5vw;
`;

const LogoTextContent = styled.span`
  text-transform: lowercase;
  font-size: 1.3vw;
  padding-left: 1vw;
`;
const server = process.env.REACT_APP_SERVER;
const socket = socketIOClient(server, { secure: true });
class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      message: "",
      messages: [],
      isTyping: false,
      typingSocket: false,
      timeout: undefined,
      connectionInformation: "",
      chatRooms: ["general", "room1", "room2"],
      currentRoom: "general",
      sendMouseMessage: false,
      isEmojiOpen: false
    };
  }

  componentDidMount = () => {
    this.scrollToBottom();
    this.setState({
      username: this.props.nickname
    });
    socket.emit("adduser", this.props.nickname, this.state.currentRoom);
    socket.on("updatechat", (username, data) => {
      this.setState({
        connectionInformation: data
      });
      socket.emit("GET_ROOM_USERS", this.state.currentRoom);
    });

    socket.on("RECEIVE_MESSAGE", data => {
      this.handleUpdateAddMessage(data);
    });
  };

  componentDidUpdate = () => {
    this.scrollToBottom();
  };

  handleUpdateAddMessage = props => {
    this.setState({
      messages: [...this.state.messages, props],
      backInfo: ""
    });
  };

  handleClearMessage = () => {
    this.setState({
      message: ""
    });
  };

  handleUpdateTyping = props => {
    this.setState({
      typingSocket: props
    });
  };

  handleUpdateNotTyping = props => {
    this.setState({
      typingSocket: props
    });
  };

  handleUpdateInputChanges = props => {
    this.setState({
      message: props
    });
  };

  handleUpdateIsTyping = props => {
    this.setState({
      isTyping: props
    });
  };

  handleUpdateTimeout = props => {
    this.setState({
      timeout: props
    });
  };

  handleUpdateUsername = props => {
    this.setState({
      username: props
    });
  };

  handleUpdateActiveChatroom = props => {
    this.setState(
      {
        currentRoom: props,
        messages: []
      },
      () => {
        socket.emit("GET_ROOM_USERS", this.state.currentRoom);
      }
    );
    socket.emit("switchRoom", props, this.state.username);
    socket.emit("GET_ROOM_USERS", this.state.currentRoom);
  };

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest"
    });
  };

  handleSendMouseBtnMessage = props => {
    this.setState({
      sendMouseMessage: props
    });
  };

  handleOpenEmojiPicker = props => {
    this.setState({
      isEmojiOpen: props
    });
  };
  render() {
    return (
      <Background id="background">
        <GlobalStyles />
        <LeftContainer id="left-container">
          <LeftHeader id="left-header">
            <RoomHeader id="room-header">Rooms</RoomHeader>
          </LeftHeader>
          <LeftContentWrapper id="left-content-wrapper">
            <RoomsWrapper id="rooms-wrapper">
              <RoomsBar
                id="rooms-bar"
                handleUpdateActiveChatroom={this.handleUpdateActiveChatroom}
                chatRooms={this.state.chatRooms}
              />
            </RoomsWrapper>
          </LeftContentWrapper>
        </LeftContainer>
        <CenterContainer id="center-container">
          <CenterHeader id="center-header">
            <HamburgerMenuWrapper id="hamburger-menu-wrapper">
              <HamburgerMenu id="hamburger-menu" src={HamburgerMenuImage} />
            </HamburgerMenuWrapper>
            <CurrentRoomInfo
              id="current-room-info"
              currentRoom={this.state.currentRoom}
            />
          </CenterHeader>
          <CenterContentWrapper id="center-content-wrapper">
            <MessageWrapper id="message-wrapper">
              {this.state.messages.map(message => {
                return (
                  <SingleMessage key={message.name} id="single-message">
                    <MessageAuthor id="message-author">
                      {message.author}
                    </MessageAuthor>
                    <MessageContent id="message-content">
                      {message.message}
                    </MessageContent>
                  </SingleMessage>
                );
              })}
              <div
                style={{ float: "left", clear: "both" }}
                ref={el => {
                  this.messagesEnd = el;
                }}
              ></div>
            </MessageWrapper>
            <WritingInformationWrapper id="writing-information-wrapper">
              <WritingInformation id="writing-information">
                {this.state.typingSocket ? `Someone is typing ...` : null}
              </WritingInformation>
            </WritingInformationWrapper>
            <InputContainer id="input-container">
              <InputWrapper id="input-wrapper">
                <Message
                  id="message"
                  socket={this.state.socket}
                  value={this.state.message}
                  sendMessage={this.sendMessage}
                  currentRoom={this.state.currentRoom}
                  onKeyDownNotEnter={this.onKeyDownNotEnter}
                  handleUpdateInputChanges={this.handleUpdateInputChanges}
                  clearMessage={this.handleClearMessage}
                  username={this.state.username}
                  message={this.state.message}
                  handleUpdateTyping={this.handleUpdateTyping}
                  handleUpdateNotTyping={this.handleUpdateNotTyping}
                  handleUpdateAddMessage={this.handleUpdateAddMessage}
                  isTyping={this.state.isTyping}
                  handleUpdateIsTyping={this.handleUpdateIsTyping}
                  handleUpdateTimeout={this.handleUpdateTimeout}
                  timeoutValue={this.state.timeout}
                  sendMouseMessage={this.state.sendMouseMessage}
                  handleSendMouseBtnMessage={this.handleSendMouseBtnMessage}
                  isEmojiOpen={this.state.isEmojiOpen}
                />
                <SvgWrapper>
                  <Emojis
                    handleOpenEmojiPicker={this.handleOpenEmojiPicker}
                    id="emojis-icon"
                  />
                  <SendButton
                    handleSendMouseBtnMessage={this.handleSendMouseBtnMessage}
                    id="send-button"
                  />
                </SvgWrapper>
              </InputWrapper>
            </InputContainer>
          </CenterContentWrapper>
        </CenterContainer>
        <RightContainer>
          <RightHeader>
            <LogoContainer>
              <LogoWrapper id="logo-wrapper">
                <Logo src={LogoImage} alt="Cirrus logo" />
                <LogoTextContent>cirrus</LogoTextContent>
              </LogoWrapper>
            </LogoContainer>
          </RightHeader>
          <RightContentWrapper id="right-content-wrapper">
            <ConnectedUsers
              id="connected-users"
              key={ConnectedUsers}
              username={this.state.username}
              currentRoom={this.state.currentRoom}
            />
          </RightContentWrapper>
        </RightContainer>
      </Background>
    );
  }
}

export default Chat;
