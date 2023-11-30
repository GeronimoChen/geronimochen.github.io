//enum:page momde!
const PAGE_MODE = {
    EDIT: "edit",
    VIEW: "view"
}
//enum:valid message formats
const MESSAGETYPES = {
    BROADCAST: "/broadcast/",
    PRIVATE: "/private/",
}
const MESSAGES = {
    START_CHAT: "/start_chat/",
    END_CHAT: "/end_chat/",
    SYNC_CHAT_REQUEST: "/sync_chat_request/"
}
//this is just about chat window, is open: active, is close: inactive
const CHAT_STATE = {
    ACTIVE: "active",
    INACTIVE: "inactive"
}
function getCurrentClinetIdentity() {
    return clientChatObject._myself.identity;
}
function getChatUserName() {
    return localStorage.getItem('chatUserName')
}
function getChatEmailAddress() {
    return localStorage.getItem('chatEmailAddress');
}
function setChatUserName(username) {
    localStorage.setItem('chatUserName', username)
}
function setChatEmailAddress(email) {
    localStorage.setItem('chatEmailAddress', email);
}
//connected members
var users = [];


const AuthorWelcomeMessagePrefix = 'Welcome to the chat room for my iPoster';
function buildBroadcasterMessage(messageType, messageText, addressedUserIdentity) {
    let messageObject = {
        posterId: posterId,
        scheduleId: selectedChatScheduleId,
        addressedUserIdentity: addressedUserIdentity,
        text: messageText,
        type: messageType,
        chatState: !selectedChatScheduleId || !posterId || authorChatWindowState == CHAT_STATE.INACTIVE ? CHAT_STATE.INACTIVE : CHAT_STATE.ACTIVE,
    }
    return JSON.stringify(messageObject);
}
//chat helper object
var chatHelper;

//main chat objects
var clientChatObject;
var posterChatChannel;

//current poster info
var posterId;
var selectedChatScheduleId;
var posterTitle;
var authorNames;

//diagnostic information
var pageMode;
var AuthorWelcomeMessage;

//client information
var selectedChatScheduleId
var clientUniqueName;
var guestId;
var clientChatWindowState;
var authorChatWindowState
//~ when document is ready:
$(function () {
    initializeChat();
});

//functionality
function initializeChat() {

    if (isChatEnable()) {
        chatHelper = new ChatHelper();
    }
    let chatStatus = getChatFeatureStatus();
    if (chatStatus == false) return;

    initializeChatRequiredFields();

    if (pageMode == PAGE_MODE.EDIT && isAuthor())
        authorChatInitialization(chatHelper, clientUniqueName, getChatUserName());

    else if (pageMode == PAGE_MODE.VIEW)
        visitorChatInitialization(chatHelper, clientUniqueName, getChatUserName());

    setEvents();
}
function initializeChatRequiredFields() {
    clientChatWindowState = CHAT_STATE.INACTIVE;
    authorChatWindowState == CHAT_STATE.INACTIVE;
    posterId = $('#PageShortName').val();
    posterTitle = getPosterTitle();
    authorNames = getAuthorNames();
    pageMode = getPageMode();

    if (pageMode == PAGE_MODE.EDIT && isAuthor() == true) {
        AuthorWelcomeMessage = AuthorWelcomeMessagePrefix + ' "' + getPosterTitle().trim() + '"'
    }

    if (getUserName())
        setChatUserName(getUserName());

    if (getUserEmail())
        setChatEmailAddress(getUserEmail());

    guestId = getChatUserUniqueIdForGuests();

    //Notice: We should not pass the ChatEmailAddress to this method!
    clientUniqueName = getChatUserUniqueName(getUserEmail(), guestId);
}
function getChatFeatureStatus() {
    return Boolean.parse($('#hdnChatIsEnable').val()) && (isAuthor() == true || Boolean.parse($('#hdnChatIsAboutToBeStarted').val()));
}
function isChatEnable() {
    return Boolean.parse($('#hdnChatIsEnable').val());
}
function getPosterTitle() {
    let posterTitle = $('#iTitleStudy').text();
    if (posterTitle)
        return posterTitle.trim();

    return $('#hdnBatchedAbstractTitle').val().trim();
}
function getAuthorNames() {
    return $('#iAuthorNames').text();
}
function getPageMode() {
    return Boolean.parse($('#EditMode').val()) == true ? PAGE_MODE.EDIT : PAGE_MODE.VIEW;
}
function getUserName() {
    return $('#ClientName').val();
}
function getUserEmail() {
    return $('#ClientEmailAddress').val();
}
function isAuthor() {
    return Boolean.parse($('#AuthorLoggedIn').val());
}
function getChatUserUniqueIdForGuests() {
    let chatGuestUserUniqueId = $('#GuestId').val();
    if (chatGuestUserUniqueId) {
        return chatGuestUserUniqueId;
        return alert('guest user id not found.');;
    }
}
function getChatUserUniqueName(clientEmailAddress, guestId) {
    //Notice: an author in edit mode must have different name than author in view mode! They must be considered as two different users in twilio 
    let storageKey = pageMode == PAGE_MODE.EDIT ? 'editror_clientUniqueName' : 'visitor_clientUniqueName';
    let storedName = localStorage.getItem(storageKey);
    if (storedName && storedName != "undefined") {
        return storedName;
    }
    let clientUniqueName = (clientEmailAddress ? clientEmailAddress : guestId) + '_' + new Date().getTime();
    localStorage.setItem(storageKey, clientUniqueName);
    return clientUniqueName;
}
function authorChatInitialization(chatHelper, clientUniqueName, clientName) {

    chatHelper.initializeClientChatObject(clientUniqueName, clientName).then(initializationResult => {
        if (initializationResult.status == false) {
            return alert(initializationResult.message);
        }
        clientChatObject = initializationResult.clientChatObject;
        authorInitializationCompleteEvent(chatHelper, clientChatObject);
    });
}
// function to handle User updates(user reachablity)
function handleUserUpdate(user, updateReasons) {

    if (user.identity == clientChatObject.user.identity)
        return;

    updateReasons.forEach(reason => {
        if (reason == 'online') {
            if (user.online == false) {
                if (posterChatChannel)
                    chatHelper.removeMember(posterChatChannel, user.identity).then(result => {
                        console.log(result.message);
                    });
            }
            else if (user.online == true) {
                setTimeout(function () {
                    sendSyncRequestMessageToSpeceficClient(chatHelper, user.identity);
                }, 2000)
            }
        }
    });
}
function authorInitializationCompleteEvent(chatHelper, clientChatObject) {

}
function visitorChatInitialization(chatHelper, clientUniqueName, clientName) {
    chatHelper.initializeClientChatObject(clientUniqueName, clientName).then(initializationResult => {
        if (initializationResult.status == false) {
            return alert(initializationResult.message);
        }
        clientChatObject = initializationResult.clientChatObject;
        visitorInitializationCompleteEvent(chatHelper, clientChatObject);
    });

}
function loadVisitorNameAndEmail() {
    try {
        $(".ChatUserName").val(getChatUserName());
        $(".ChatEmailAddress").val(getChatEmailAddress());
    }
    catch (e) {
        console.error(e);
    }
}
function visitorInitializationCompleteEvent(chatHelper, clientChatObject) {
    loadVisitorNameAndEmail();
    getCurrentActiveChatService(posterId).then(function (result) {
        if (result) {
            selectedChatScheduleId = result;
            enableJoinChatButton();
        }
    });
    //var schedules=get not finished schedules.
    //for each one check channel existance:
    //forbidden:50430: join to the channel. and check event fire on author side.
    //success:200: check online user changes on author side
    //not exists: do nothing
    //chatHelper.checkChannelExistence(clientChatObject,posterChatChannel)
}
function getPosterChatChannelUniqueName() {
    if (!selectedChatScheduleId || !posterId) {
        alert("An unexpected error occured.")
    }
    return generatePosterChatChannelUniqueName(posterId, selectedChatScheduleId)
}
function generatePosterChatChannelUniqueName(targetPosterId, chatScheduleId) {
    return targetPosterId + '_' + chatScheduleId;
}
function setUserUpdateHandlerForAllExistingUsers(channel) {
    chatHelper.getChannelMembers(channel).then(result => {
        result.forEach(member => {
            chatHelper.getUser(clientChatObject, member.identity).then(user => {
                user.on('updated', event => handleUserUpdate(event.user, event.updateReasons));
            });
        });
    });
}

function broadcastChatHasEndedMessage(chatHelper) {
    let signedMessage = buildBroadcasterMessage(messageType = MESSAGETYPES.BROADCAST, messageText = MESSAGES.END_CHAT);
    return sendChatSatusChangedSignal(posterId, signedMessage);
}
function resetPosterChatChannelListeners(chatHelper, channel) {
    chatHelper.removeAllChannelListeners(channel);
    chatHelper.addListenerOnMessageAddedEvent(channel, newMessageReceivedEvent);
    //Author in edit mode
    if (pageMode == PAGE_MODE.EDIT && isAuthor()) {
        chatHelper.addListenerOnMemberJoinedEvent(channel, memberJoinedEvent);
        chatHelper.addListenerOnMemberLeftEvent(channel, memberLeftEvent);
    }
}
function broadcastChatHasStartedMessage(chatHelper) {
    let signedMessage = buildBroadcasterMessage(messageType = MESSAGETYPES.BROADCAST, messageText = MESSAGES.START_CHAT);
    return sendChatSatusChangedSignal(posterId, signedMessage);
}
function sendSyncRequestMessageToSpeceficClient(chatHelper, userIdentity) {
    let signedMessage = buildBroadcasterMessage(messageType = MESSAGETYPES.PRIVATE, messageText = MESSAGES.SYNC_CHAT_REQUEST, addressedUserIdentity = userIdentity);
    return sendChatSatusChangedSignal(posterId, signedMessage);
}
function isAuthorChatWindowOpen() {
    return $("#popup-chat").is(':visible') || $(".popupwindow_minimized").is(':visible') || $("#popup-chat").is(':visible') || $(".chat-box-z-index").is(':visible');
}
function startChat(chatScheduleId) {
    if (!chatScheduleId) {
        alert("Input parameter 'chatScheduleId' is not valid.");
        return;
    }
    initializeGeneralChatChannel(chatScheduleId).then(initResult => {
        if (initResult == false) {
            alert(initResult.message);
            return;
        }
        openAuthorChatPanel();

        authorChatWindowState = CHAT_STATE.ACTIVE;
        if (AuthorWelcomeMessage) {
            sendMessageByAuthor(AuthorWelcomeMessage);
        }
        $('.popupwindow_titlebar_button_close').unbind('click').bind("click", function () {
            window.onbeforeunload = null;
            $(".EndChat").trigger("click");
        });

    })
}
function initializeGeneralChatChannel(chatScheduleId) {
    selectedChatScheduleId = chatScheduleId;
    return new Promise((resolve) => {
        let channelUniqueName = getPosterChatChannelUniqueName();
        chatHelper.getChannelByUniqueName(clientChatObject, channelUniqueName).then(function (getExistingChannelResult) {
            if (!getExistingChannelResult.channel) {
                chatHelper.createNewChannel(clientChatObject, channelUniqueName, posterTitle).then(createChannelResult => {
                    if (createChannelResult.status == false) {
                        resolve({ status: false, message: createChannelResult.message });
                    }
                    posterChatChannel = createChannelResult.channel;
                    chatHelper.joinToChannel(posterChatChannel).then(joinResult => {
                        if (joinResult.code == false) {
                            resolve({ status: false, message: joinResult.message });
                        }

                        resetPosterChatChannelListeners(chatHelper, posterChatChannel);
                        broadcastChatHasStartedMessage(chatHelper);
                        resolve({ status: true });

                    });
                });
            }
            else {
                if (getExistingChannelResult.status == false) {
                    resolve({ status: false, message: getExistingChannelResult.message });
                }
                posterChatChannel = getExistingChannelResult.channel;
                chatHelper.joinToChannel(posterChatChannel).then(joinResult => {
                    if (joinResult.code == false) {
                        resolve({ status: false, message: joinResult.message });
                    }

                    resetPosterChatChannelListeners(chatHelper, posterChatChannel);
                    broadcastChatHasStartedMessage(chatHelper);
                    resolve({ status: true });

                });
            }
        });

    });
}
function createAdditionalMessageAttributesJsonObject(senderEmailAddress, senderName, senderIsAuthor, sourceUsername, sourceMessage) {
    return {
        "senderEmailAddress": senderEmailAddress,
        "senderName": senderName,
        "senderIsAuthor": senderIsAuthor,
        "sourceUsername": sourceUsername,
        "sourceMessage": sourceMessage
    }
};
function sendMessage(chatHelper, channel, message, sourceUsername = null, sourceMessage = null) {
    var additionalProperties = createAdditionalMessageAttributesJsonObject(getChatEmailAddress(), getChatUserName(), isAuthor(), sourceUsername, sourceMessage);
    //isRepliedMessage and parentMessageId are just sent for now and dont use.
    chatHelper.sendMessage(channel, message, additionalProperties);

}
function createAdditionalUserAttributesJsonObject(emailAddress, name, isAuthor) {
    return {
        "emailAddress": emailAddress,
        "name": name,
        "isAuthor": isAuthor
    }
};
function chatStartedEvent(channel) {
    if (pageMode == PAGE_MODE.EDIT && isAuthor())
        return;
    enableJoinChatButton();

}
function addUserToJoinedMemberList(userUniqueId, userName, userEmail) {
    let code = "";
    let userexists = false;
    userexists = users.includes(userEmail)

    if (userexists == false) {
        code = '<div class="user"  id="' + userUniqueId + '"><a id="' + userUniqueId + '" >' + userName + '</a><br /><span>' + userEmail + '</span></div>'; //" class="user"
        $("#divusers").append(code);
    }

    var height = $("#divusers")[0].scrollHeight;
    $("#divusers").scrollTop(height);
    users.push(userEmail);
}
var usersobject = [];
function memberJoinedEvent(member) {

    if (pageMode == PAGE_MODE.EDIT) {
        chatHelper.getUser(clientChatObject, member.identity).then(user => {
            addUserToJoinedMemberList(member.identity, user.attributes.name, user.attributes.emailAddress);
        });
    }
}
function resetChatForAuthor() {
    posterChatChannel = null;
    users = [];
    closeChatWindow();
}
function chatEndedEvent() {
    //this event does not call for author
    if (pageMode == PAGE_MODE.EDIT && isAuthor()) {
        resetChatForAuthor();
    }
    else
        endClientChatByForceOfTheAuthor();
}
function memberLeftEvent(member) {

    if (pageMode == PAGE_MODE.EDIT) {
        chatHelper.getUserDescriptor(clientChatObject, member.identity).then(user => {

            removeUserFromJoinedMemberList(member.identity, user.attributes.emailAddress);
        });
    }
}
function removeUserFromJoinedMemberList(userId, userEmailAddress) {
    var index = users.indexOf(userEmailAddress);
    if (index >= 0) {
        $("#" + userId).remove();
        //we should remove user from twilio here
        users.splice(index, 1);
    }
}
function extractBroadcastedMessageData(receivedMessage) {
    return JSON.parse(receivedMessage);
}
function newBroadcastedMessageReceivedEvent(message) {

    if (pageMode != PAGE_MODE.VIEW)
        return;//ignore it.
    let extractedMessageData = extractBroadcastedMessageData(message);

    if (extractedMessageData.scheduleId) {
        selectedChatScheduleId = extractedMessageData.scheduleId;
    }
    if (extractedMessageData.posterId !== posterId)
        return; //ignore it.
    if (extractedMessageData.type === MESSAGETYPES.PRIVATE && extractedMessageData.addressedUserIdentity !== clientUniqueName)
        return;//ignore it
    if (extractedMessageData.chatState == CHAT_STATE.INACTIVE) {
        return disableJoinChatButton();
    }
    if (extractedMessageData.text === MESSAGES.START_CHAT) {
        selectedChatScheduleId = extractedMessageData.scheduleId;
        chatStartedEvent();
    }
    else if (extractedMessageData.text === MESSAGES.END_CHAT) {
        chatEndedEvent();
    }
    //it means client conneced again: so we need to sync 
    else if (extractedMessageData.text === MESSAGES.SYNC_CHAT_REQUEST) {
        if (clientChatWindowState == CHAT_STATE.ACTIVE) {
            chatHelper.joinToChannel(posterChatChannel).then(joinResult => {
                if (joinResult.status == false) {
                    //member already exists
                    if (joinResult.code == "50404") {
                        ;
                    }
                    else
                        alert('Your connection has been lost! please end chat and join again.');
                }
                resetPosterChatChannelListeners(chatHelper, posterChatChannel);
            });
        }
        else if (clientChatWindowState == CHAT_STATE.INACTIVE) {
            disableJoinChatButton();
        }
    }
}
function newMessageReceivedEvent(message) {

    printMessageOnScreen(message.sid, message.attributes.senderIsAuthor, message.attributes.senderName, message.body, message.author == clientUniqueName, message.attributes.sourceUsername, message.attributes.sourceMessage);
}
function generateMessageHtmCode(messageObject) {

    let repliedMessaga = messageObject.isAReplyMessage == true ? '<span class="AuthorReply">@' + messageObject.originalMessageTitle + ": " + messageObject.originalMessageBody + '</span>' : ""
    let newMessageTitle = '<span><b class="userName' + (messageObject.messageSenderIsAuthor == true ? " isAuthor" : "") + '" messageTitle="' + messageObject.messageTitle + '" id="username_' + messageObject.messageId + '">' + messageObject.messageTitle + '</b></span>';
    let newMessage = '<span id=message_' + messageObject.messageId + '>' + messageObject.messageBody + ' </span>'

    let replyButton = messageObject.showReplyButton == true && !isAuthor() ? '<button id="replyButton_' + messageObject.messageId + '" class="answer submitButton">' + $('.answerText').html() + '</button>' : "";

    let result = '<div id=' + messageObject.messageId + ' class="message">' + newMessageTitle + ': ' + repliedMessaga + newMessage + '<br />' + replyButton + '</div>';
    return result;
}
function printMessageOnScreen(messageId, messageHasBeenSentByAuthor, username, message, messageHasBeenSentByCurrentClient, sourceUsername, sourceMessage) {
    let isReplyMessage = (sourceUsername && sourceMessage) ? true : false;
    let messageGeneratorInputObject = {
        messageId: messageId,
        messageTitle: username,
        messageSenderIsAuthor: messageHasBeenSentByAuthor,
        messageBody: message,
        isAReplyMessage: isReplyMessage,
        originalMessageTitle: sourceUsername,
        originalMessageBody: sourceMessage,
        showReplyButton: pageMode == PAGE_MODE.EDIT && isAuthor() == true && !isReplyMessage,
    }
    var messageElementHtmlCode = generateMessageHtmCode(messageGeneratorInputObject);
    $('#divChatWindow').append(messageElementHtmlCode);

    if (pageMode == PAGE_MODE.EDIT && isAuthor() == true) {
        $(".answer").unbind("click").bind('click', function (e) {

            e.preventDefault();

            var replyingto = $("#ParenMessagetId").attr("msgId");
            var cId = $(this).parent(".message").attr("id");

            if (replyingto != cId) {

                $("#ParenMessagetId").attr("msgId", cId);
                var userName = $("#username_" + cId).attr("messageTitle");

                $("#ParenMessagetId").text("Replying to: " + userName);
                $(".StopReply").show();
            }
        });
    }

    var height = $('#divChatWindow')[0].scrollHeight;
    $('#divChatWindow').scrollTop(height);
}
function printMessageHistoryOnScreen(messages) {

    for (var i = 0; i < messages.length; i++) {
        var messageElementHtmlCode = generateMessageHtmCode(messages[i]);
        $('#divChatWindow').append(messageElementHtmlCode);
    }
    var height = $('#divChatWindow')[0].scrollHeight;
    $('#divChatWindow').scrollTop(height);
}
function closeChatWindow() {
    $("#divusers").empty();
    $('#divChatWindow').empty()
    $("#popup-chat").PopupWindow("close");
    $("#popup-chat").hide();
}
function enableJoinChatButton() {
    $("#ctl00_LoginChatPnl").show();
    $("#ctl00_ChatClosedPnl").hide();
}
function disableJoinChatButton() {

    $("#ctl00_LoginChatPnl").hide();
    $("#ctl00_ChatClosedPnl").show();

}
function sendMessageByClient(message) {
    sendMessage(chatHelper, posterChatChannel, message);
    setTimeout(function () {
        $("#txtMessage").val("");
    }, 100);
    $(".StopReply").hide();
}
function sendMessageByAuthor(message) {

    var sourceMessage = getSourceMessage();
    var sourceUsername = getSourceUsername();

    sendMessage(chatHelper, posterChatChannel, message, sourceUsername, sourceMessage);
    setTimeout(function () {
        $("#txtMessage").val("");
        stopReply();
    }, 100);

}
function getSourceMessage() {
    var messageId = $("#ParenMessagetId").attr("msgid");
    if (messageId)
        return $("#message_" + messageId).text();
    else
        return null;
}
function getSourceUsername() {
    var messageId = $("#ParenMessagetId").attr("msgid");
    if (messageId)
        return $("#username_" + messageId).text();
    else
        return null;
}
function stopReply() {
    $("#ParenMessagetId").text("");
    $("#ParenMessagetId").removeAttr("msgId");
    $(".StopReply").hide();
}
function clearChatWindow() {
    $("#divChatWindow").html("");
}
function clientSetupChatWindow() {
    $("#divusers").html("");
    $("#UsersPanel").hide();
    $("body").find("div#wrapper").addClass("isUserIposterWrapper");
    $("body").find("div.w1").addClass("isUserIposterW1");
    $("body").find("div.w2").addClass("isUserIposterW2");

    $("#popup-chat").addClass("isUser");
    $(".isUser").parent("div").addClass("parentIsUser");
    setTimeout(function () {
        $(".parentIsUser").parent("#fancybox-content").addClass("isUserBoxContet");
        $(".isUserBoxContet").parent("div").parent("#fancybox-wrap").addClass("isUserWrap");
        $(".isUserWrap").prev("#fancybox-overlay").addClass("isUserOverlay");
    }, 500);
}
function endClientChatByForceOfTheClient(chatHelper, channel) {
    chatHelper.leaveChannel(channel).then(leaveResult => {
        if (leaveResult.status == false) {
            console.error(leaveResult);
        }
        showBackButton();
        removeIsUser();
        $("#popup-chat").hide();
        enableJoinChatButton();
        clientChatWindowState = CHAT_STATE.INACTIVE;
    });


}
async function joinChat(username, email) {
    let getChannelResult = chatHelper.getChannelByUniqueName(clientChatObject, getPosterChatChannelUniqueName());
    //we can update user attr just when username or email are different of current data
    let updateResult = await chatHelper.updateUserAttributes(clientChatObject, createAdditionalUserAttributesJsonObject(email, username, isAuthor()));
    //it happens when join chat button, clicks multiple
    if (updateResult.status == false)
        console.error(updateResult.message);

    //update client data
    setChatUserName(username);
    setChatEmailAddress(email);

    getChannelResult = await getChannelResult;
    if (getChannelResult.status == false && getChannelResult.code == 50430/*Is forbidden for the current client*/) {
        let joinToChannelResultCode = await joinClientToTheChannelService(getPosterChatChannelUniqueName(), getCurrentClinetIdentity());
        if (joinToChannelResultCode != "200") {
            if (joinToChannelResultCode == "50404") {
                console.warn('warning code ' + joinToChannelResultCode + ':' + 'Member already exists.');
            }
            else if (joinToChannelResultCode == "50403") {
                alert('This chat is full. Please try again later.');
                return;
            }
            else {
                console.error(`Server respond with error code: ${joinToChannelResultCode}`);
                return;
            }
        }
    }
    else if (getChannelResult.status == false) {
        console.error(getChannelResult.message);
        return;
    }
    getChannelResult = await chatHelper.getChannelByUniqueName(clientChatObject, getPosterChatChannelUniqueName());

    if (getChannelResult.status == false) {
        alert('getchannelresult ' + getChannelResult.message);
        return;
    }
    posterChatChannel = getChannelResult.channel;
    clearChatWindow();

    //load chat message history (old conversations):
    chatHelper.getAllRawMessages(posterChatChannel, clientUniqueName).then(getMessagesResult => {
        if (getMessagesResult.status == false) {
            console.error(getMessagesResult.message);
            return;
        }

        printMessageHistoryOnScreen(getMessagesResult.data);
    });


    resetPosterChatChannelListeners(chatHelper, posterChatChannel);
    clientSetupChatWindow();
    openChatPnnel();
    clientChatWindowState = CHAT_STATE.ACTIVE;
}
function endClientChatByForceOfTheAuthor() {
    removeIsUser();
    $("#popup-chat").hide();
    showBackButton();
    disableJoinChatButton();
    if (chatHelper && posterChatChannel)
        chatHelper.leaveChannel(posterChatChannel);
    if (clientChatWindowState == CHAT_STATE.ACTIVE) {
        setTimeout(function () {
            let message = 'The author has closed the chat. Please use the "Contact Author" button to get in touch with the author. \r\nNotice: If you want to download your chat history Click on \'OK\' button otherwise press cancel button.';
            var confirmationResult = confirm(message);
            if (confirmationResult == true) {
                downloadChatConversation(getPosterChatChannelUniqueName());//download chat history
            } else {
                ;//do nothing
            }
        }, 300);

    }
    clientChatWindowState = CHAT_STATE.INACTIVE;
}
function downloadChatConversation(channelUniqueId, showLoadingPannel = false) {
    try {
        if (showLoadingPannel === true) {
            $("#loading h3").html("LOADING CHAT...");
            $("#loading-background").css('opacity', '0.7');
            $(".loading").fadeIn();
        }
        chatHelper.getAllFormattedMessages(channelUniqueId).then(result => {
            if (showLoadingPannel === true) {
                $(".loading").hide();
                $("#loading h3").html("LOADING...");
                $("#loading-background").css('opacity', '1');
            }
            setTimeout(function () {
                if (result && result.data) {
                    let dataObject = JSON.parse(result.data);
                    if (dataObject.status === true) {
                        result.data = (posterTitle ? posterTitle + "\r\n" : "") + (authorNames ? authorNames.trim() + "\r\n" : "") + dataObject.data;
                    }
                    else return alert(dataObject.message);
                    //result.data = dataObject.message;
                }
                else return alert(result.message);
                downloadDataAsAFile(result.data);
            }, 300);

        });

    } catch (e) {
        if (showLoadingPannel === true) {
            $(".loading").hide();
            $("#loading h3").html("LOADING...");
            $("#loading-background").css('opacity', '1');
        }
        console.error(e);
    }
    finally {

    }
}
function downloadDataAsAFile(data) {


    var link = document.createElement('a');
    link.setAttribute('download', 'ChatConversation' + Date.now().toLocaleString() + '.txt');
    link.href = makeTextFile(data);
    document.body.appendChild(link);

    // wait for the link to be added to the document
    window.requestAnimationFrame(function () {
        var event = new MouseEvent('click');
        link.dispatchEvent(event);
        document.body.removeChild(link);
    });

}
function makeTextFile(text) {
    let textFile = null;
    var data = new Blob([text], { type: 'text/plain' });

    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (textFile !== null) {
        window.URL.revokeObjectURL(textFile);
    }

    textFile = window.URL.createObjectURL(data);

    return textFile;
}
function endOwnerChat(chatHelper) {
    broadcastChatHasEndedMessage(chatHelper).then(result => {
        resetChatForAuthor();
    })

}
function removeIsUser() {
    $(".isUserWrap").prev("#fancybox-overlay").removeClass("isUserOverlay");
    $(".isUserBoxContet").parent("div").parent("#fancybox-wrap").removeClass("isUserWrap");
    $(".parentIsUser").parent("#fancybox-content").removeClass("isUserBoxContet");
    $(".isUser").parent("div").removeClass("parentIsUser");
    $("#popup-chat").removeClass("isUser");
    $("body").find("div#wrapper").removeClass("isUserIposterWrapper");
    $("body").find("div.w1").removeClass("isUserIposterW1");
    $("body").find("div.w2").removeClass("isUserIposterW2");


}
function validateJoinChatInputs(userName, email) {
    if (userName && email && ValidateEmail(email)) //ChatDetailid 
    {
        return true;
    }

    return false;
}
function ValidateEmail(email) {
    var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    return expr.test(email);
};
function openChatPnnel() {
    $("#popup-chat").show();
    $("#ctl00_LoginChatPnl").hide();
    $("#fancybox-close").trigger("click");
    $('#spnWarning').hide();
    hideBackButton();
}
function openAuthorChatPanel() {

    $("#popup-chat").show();
    $("#popup-chat").PopupWindow("open");
    $("#fancybox-close").trigger("click");
}
function setEvents() {
    window.addEventListener('beforeunload', async function (e) {

        if (pageMode == PAGE_MODE.EDIT && isAuthor() && posterChatChannel) {
            broadcastChatHasEndedMessage(chatHelper);
        }
        else {
            if (posterChatChannel)
                chatHelper.leaveChannel(posterChatChannel);
        }
    });

    $("#popup-chat").parent("div").parent("#fancybox-content").parent("div").parent("#fancybox-wrap").addClass("ChatBoxContet");

    removeIsUser();

    $(".StopReply").hide();
    $("#joinChatLogin").unbind("click").bind('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        try {
            $('#spnWarning').hide();
            let userName = $(".ChatUserName").val();
            let email = $(".ChatEmailAddress").val();

            if (validateJoinChatInputs(userName, email)) {
                joinChat(userName, email);
            }
            else {

                if (!userName) {
                    $('#spnWarning').text('Please enter name!');
                    $('#spnWarning').show();

                } else if (!email) {
                    $('#spnWarning').text('Please enter email!');
                    $('#spnWarning').show();

                } else if (!ValidateEmail(email)) {
                    $('#spnWarning').text('Invalid email address.');
                    $('#spnWarning').show();

                }
                closeChatWindow();


                $("#ctl00_LoginChatPnl").show();
            }

            return false;
        } catch (e) {
            console.error(e);
        }
        finally {

        }
    });
    $(".EndChat").unbind("click").bind('click', function (e) {
        if (pageMode == PAGE_MODE.EDIT && isAuthor()) {
            getwarnmessage = confirm("Do you want to end chat? This will remove all messages and users from the chat.");
            if (getwarnmessage) {
                endOwnerChat(chatHelper);
            }
        }
        else {
            var getwarnmessage = confirm("Do you really want to close chat?");

            if (getwarnmessage) {
                endClientChatByForceOfTheClient(chatHelper, posterChatChannel);
            }
        }


        window.onbeforeunload = null;
        e.preventDefault();
        return false;

    });
    $("a[data-toggle='modal']").unbind("click").bind('click', function (e) {

        e.preventDefault();
        var getId = $(this).attr("data-target");
        if (!getId) return;
        $(getId).toggle();
        $(getId).removeClass("fade");
        $("#fancybox-close").trigger("click");
        //var close = $(".close").attr("data-dismiss");
    });

    $('.btnSendMsg').unbind("click").bind('click', function (e) {


        var message = $("#txtMessage").val();
        if (message && message.trim()) {
            if (pageMode == PAGE_MODE.EDIT && isAuthor())
                sendMessageByAuthor(message.trim());
            else
                sendMessageByClient(message.trim());
        }
        e.preventDefault();
        return false;
    });

    $(".SaveChat").unbind("click").bind('click', function (e) {

        e.preventDefault();

        downloadChatConversation(getPosterChatChannelUniqueName());

    });

    $(".ChatEmailAddress").keypress(function (e) {

        if (e.which == 13) {
            $("#joinChatLogin").click();
        }
    });

    $('#txtMessage').unbind('keyup').bind('keyup', function (e) {

        if (e.which == 13 && !e.shiftKey) {
            var message = $("#txtMessage").val().trim();
            if (message.trim().length > 0) {
                if (pageMode == PAGE_MODE.EDIT && isAuthor())
                    sendMessageByAuthor(message);
                else
                    sendMessageByClient(message);
            }
            e.preventDefault();
            return false;
        }
    });
    $(".StopReply").unbind("click").bind('click', function (e) {
        e.preventDefault();
        $("#ParenMessagetId").text("");
        $("#ParenMessagetId").removeAttr("msgId");
        $(".StopReply").hide();
    });
}