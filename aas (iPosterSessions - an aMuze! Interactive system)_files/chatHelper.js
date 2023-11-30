class ChatHelper {

    constructor() { }

    //public functions
    initializeClientChatObject(clientUniqueName, clientName) {
        let clientChatObject;
        return new Promise(resolve => {
            getNewTokenService(clientUniqueName).then((data) => {
                this.createClientChatObject(data.token).then((client) => {
                    clientChatObject = client;

                    // when the access token is about to expire, refresh it
                    clientChatObject.on('tokenAboutToExpire', () => { this.refreshToken(clientChatObject, clientUniqueName); });

                    // if the access token already expired, refresh it
                    clientChatObject.on('tokenExpired', () => { this.refreshToken(clientChatObject, clientUniqueName); });
                    resolve({ status: true, clientChatObject: clientChatObject, message: 'Initialization complete successfully for "' + clientName + '"', code: 200 });
                }).catch(error => {
                    resolve({ status: false, clientChatObject: null, message: error.message, code: error.code });
                });
            });

        });
    }
    refreshToken(clientChatObject, clientIdentity) {

        getNewTokenService(clientIdentity).then((data) => {
            this.updateToken(clientChatObject, data.token);
        }).catch((error) => {
            console.error(error);
        });
    }
    createClientChatObject(token) {
        return Twilio.Conversations.Client.create(token);
    }
    updateToken(clientChatObject, token) {
        clientChatObject.updateToken(token);
    }
    getChannelByUniqueName(clientChatObject, uniqueName) {
        return new Promise(resolve => {
            clientChatObject.getConversationByUniqueName(uniqueName).then(result => {
                resolve({ status: true, channel: result, message: 'success', code: 200 });
            }).catch(error => {

                resolve({ status: false, channel: null, message: error.message, code: error.body ? error.body.code : -1 });
            });
        });
    }
    getChannelByUniqueSid(clientChatObject, sid) {
        return new Promise(resolve => {
            clientChatObject.getConversationBySid(sid).then(result => {
                resolve({ status: true, channel: result, message: 'success', code: 200 });
            }).catch(error => {
                resolve({ status: false, channel: null, message: error.message, code: error.body ? error.body.code : -1 });
            });
        });
    }
    eventHasBeenRegisteredOnObjectBefore(objectInstance, eventName) {
        return Object.keys(objectInstance._events).findIndex(a => a == eventName) > -1;
    }
    checkChannelExistence(clientChatObject, uniqueName) {
        return this.getChannelByUniqueName(clientChatObject, uniqueName);
    }
    createNewChannel(clientChatObject, uniqueName, friendlyName) {
        return new Promise((resolve) => {
            clientChatObject.createConversation({
                uniqueName: uniqueName,
                friendlyName: friendlyName
            }).then(channel => {
                resolve({ status: true, channel: channel, message: 'channel created', code: 200 });
            }).catch(error => {
                resolve({ status: false, channel: null, message: error.message, code: error.code });
            });
        });
    }
    getChannelMembers(channel) {
        return channel.getParticipants();
    }
    updateUserAttributes(clientChatObject, attributes) {
        return new Promise((resolve) => {
            clientChatObject.user.updateAttributes(attributes).then(result => {
                resolve({ status: true, code: 200, message: "success" });
            }).catch(error => {
                resolve({ status: false, code: error.body ? error.body.code:-1, message: error.message });
            });
        });
    }
    deleteChannel(channel) {
        return new Promise((resolve) => {
            channel.delete().then(data => {
                resolve({ status: true, message: 'channel deleted successfully' });
            }).catch((error) => {
                resolve({ status: false, message: error.message });
            });
        })

    }
    getUserDescriptor(clientChatObject, clientIdentity) {
        return clientChatObject.getUser(clientIdentity);
    }
    getUser(clientChatObject, clientIdentity) {
        return clientChatObject.getUser(clientIdentity);
    }
    joinToChannel(channel) {
        return new Promise((resolve) => {
            channel.join().then(data => {
                //check
                
                channel.removeAllListeners();
                resolve({ status: true, message: 'Client joined to channel', code: 200 });
            }).catch((error) => {
                //check
                channel.removeAllListeners();
                resolve({ status: false, code: error.code, message: error.message, code: error.code });
            });
        });

    }
    leaveChannel(channel) {
        return new Promise(resolve => {
            channel.leave().then(channel => {
                
                //check
                channel.removeAllListeners();
                resolve({ status: true, message: 'Client left channel.' });
            }).catch(error => {
                resolve({ status: false, message: error.message });
            });
        });
    }
    removeMember(channel, userIdentity) {
        return new Promise(resolve => {
            channel.removeParticipant(userIdentity).then(result => {
                resolve({ status: true, message: 'Member removed.' });
            }).catch(error => {
                resolve({ status: false, message: error.message });
            });
        });
    }
    addMember(channel, userIdentity) {
        return new Promise(resolve => {
            channel.add(userIdentity).then(result => {
                resolve({ status: true, message: 'Member aded.' });
            }).catch(error => {
                resolve({ status: false, message: error.message });
            });
        });

    }
    sendMessage(channel, message, additionalProperties = null) {
        return channel.sendMessage(message, additionalProperties ? additionalProperties : null);
    }
    serverSideDeleteChannel(channelId, clientUniqueName) {
        return new Promise((resolve) => {
            deleteChannelService(channelId, clientUniqueName).then(data => {
                resolve({ status: data.status, message: data.message, code: data.code });
            }).catch((error) => {
                resolve({ status: false, message: error.message, code: error.code ? error.code : undefined });
            });

        });
    }
    removeAllChannelListeners(channel) {
        //check
        
        channel.removeAllListeners();
    }
    //check: getMessages js method
    getAllFormattedMessages(channelId) {
        return new Promise((resolve) => {
            getAllFormattedMessagesService(channelId).then(result => {
                resolve({ status: true, message: "", data: result.d });
            }).catch(error => {
                resolve({ status: false, message: error.message });
            });
        });
    }
    getAllRawMessages(channel, clientUniqueName) {
        return new Promise((resolve) => {
            return getAllRawMessagesService(channel.sid, clientUniqueName).then(result => {
                resolve({ status: true, message: "data fetched successfully", data: result.d });
            }).catch(error => {
                resolve({ status: false, message: error.message });
            });
        });
    }
    checkMemberExistenceOnChannel(channel, clientUniqueName) {
        return new Promise(resolve => {
            channel.getParticipantByIdentity(clientUniqueName).then(result => {
                resolve({ status: true, message: 'User is member of channel' });
            }).catch(error => {
                resolve({ status: false, message: error.message });
            });
        });

    }
    sendTheTypingIndicatorSignal(channel) {
        channel.typing();
    }

    //events
    addListenerOnTypingEndedEvent(channel, externalFunction) {

        if (this.eventHasBeenRegisteredOnObjectBefore(channel, 'typingEnded'))
            return;

        channel.on('typingEnded', data => {

            if (externalFunction)
                externalFunction();
        });


    }
    addListenerOnTypingStartedEvent(channel, externalFunction) {

        if (this.eventHasBeenRegisteredOnObjectBefore(channel, 'typingStarted'))
            return;

        channel.on('typingStarted', data => {
            if (externalFunction)
                externalFunction();

        });


    }
    addListenerOnChannelAddedEvent(chatClientObject, externalFunction) {

        if (this.eventHasBeenRegisteredOnObjectBefore(chatClientObject, 'conversationAdded'))
            return;

        chatClientObject.on('conversationAdded', data => {
            if (externalFunction)
                externalFunction(data);
        });


    }
    addListenerOnChannelRemovedEvent(chatClientObject, externalFunction) {

        if (this.eventHasBeenRegisteredOnObjectBefore(chatClientObject, 'conversationRemoved'))
            return;

        chatClientObject.on('conversationRemoved', data => {
            if (externalFunction)
                externalFunction(data);
        });

    }
    addListenerOnMemberJoinedEvent(channel, externalFunction) {


        if (this.eventHasBeenRegisteredOnObjectBefore(channel, 'participantJoined'))
            return;
        //change test
        channel.on('participantJoined', member => {

            if (externalFunction)
                externalFunction(member);



        });


    }
    addListenerOnMemberLeftEvent(channel, externalFunction) {

        if (this.eventHasBeenRegisteredOnObjectBefore(channel, 'participantLeft'))
            return;

        channel.on('participantLeft', member => {

            if (externalFunction)
                externalFunction(member);
        });

    }
    addListenerOnMessageAddedEvent(channel, externalFunction) {


        if (this.eventHasBeenRegisteredOnObjectBefore(channel, 'messageAdded'))
            return;
        //this method should be revised
        channel.on('messageAdded', message => {

            if (externalFunction)
                externalFunction(message);
        });

    }


}

