// ./src/Chat.js

import React, { Component } from 'react';
import { ChatManager, TokenProvider } from '@pusher/chatkit-client';
import MessageList from './MessageList';
import SendMessageForm from './SendMessageForm';

class Chat extends Component {
    state = {
        currentUser: null,
        currentRoom: {},
        messages: []
    }

    componneDidMount() {
        const chatKit = new ChatManager({
            instanceLocator: 'v1:us1:a58539cb-5e05-48db-b90c-552555b9d79b',
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url:
                'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/a58539cb-5e05-48db-b90c-552555b9d79b/token'
            })
        })

        chatKit
        .connect()
        .then(currentUser => {
            this.setState({ currentUser })
            console.log('Bleep bloop you are connected to Chatkit')
            return currentUser.subscribeToRoom({
                roomId: 19422220,
                messageLimit: 100,
                hooks: {
                    onNewMessage: message => {
                        this.setState({
                            messages: [...this.state.messages, message]
                        })
                    }
                }
            })
        })
        .then(currentRoom => {
            this.setState({ currentRoom })
    })
        .catch(error => console.error('error', error))
}

    onSend = text => {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
    }

  render() {
    return (
      <div className='wrapper'>
        <div className='chat'>
            <MessageList messages={this.state.messages} />
            <SendMessageForm onSend={this.onSend} />
        </div>
      </div>
    )
  }
}

export default Chat