﻿function getNewTokenService(identity) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetNewToken',
            type: 'POST',
            data: JSON.stringify({ clientId: identity }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let jsonData = JSON.parse(data.d);
                resolve(jsonData);
            },
            error: function (error) {
                reject(error);
            },
        })
    })
}
function deleteChannelService(channelId, clientId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/DeleteChannel',
            type: 'POST',
            data: JSON.stringify({ id: channelId }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let jsonData = JSON.parse(data.d);
                resolve(jsonData);
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function getAllFormattedMessagesService(channelId) {
    let localUtcOffset = (new Date().getTimezoneOffset() * -1);
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetAllFormattedMessages',
            type: 'POST',
            data: JSON.stringify({ channelId: channelId, clientLocalTimeOffsetInMinutes: localUtcOffset }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                //let jsonData = JSON.parse(data.d);
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function getAllRawMessagesService(channelId, clientId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetAllRawMessages',
            type: 'POST',
            data: JSON.stringify({ channelId: channelId }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                //let jsonData = JSON.parse(data.d);
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function getAllChatSchedulesService(posterShortName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetAllChatSchedules',
            type: 'POST',
            data: JSON.stringify({ posterId: posterShortName }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                //let jsonData = JSON.parse(data.d);
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function getSpeceficChatScheduleService(posterShortName, id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetChatSchedule',
            type: 'POST',
            data: JSON.stringify({ posterId: posterShortName, scheduleId: id }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let jsonData = JSON.parse(data.d);
                resolve(jsonData);
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function deleteChatScheduleService(posterShortName, authorChatScheduleId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/DeleteChatSchedule',
            type: 'POST',
            data: JSON.stringify({ posterShortName: posterShortName, chatScheduleId: authorChatScheduleId }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let jsonData = JSON.parse(data.d);
                resolve(jsonData);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function checkChannelConversationExistance(channelId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/IsThereAnyConversationInChannel',
            type: 'POST',
            data: JSON.stringify({ channelId: channelId }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let jsonData = JSON.parse(data.d);
                resolve(jsonData);
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}

function saveChatSettingsService(inputData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SaveChatSettings',
            data: JSON.stringify({ indata: inputData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d.toLowerCase());
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}