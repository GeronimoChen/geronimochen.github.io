//we can centralize all of requests to local server in this file

async function getPermittedIframeDomainsService() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetPermittedIframeDomains',
            type: 'POST',
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error)
            },
        })

    });
}

function getAllSessionSchedulesService(posterShortName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetAllSessionSchedules',
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
function deleteSessionScheduleService(posterShortName, authorSessionScheduleId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/DeleteSessionSchedule',
            type: 'POST',
            data: JSON.stringify({ posterShortName: posterShortName, sessionScheduleId: authorSessionScheduleId }),

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
function saveSessionSettingsService(inputData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SaveSessionSettings',
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

function getAllAuthorPosterBoardsService(posterShortName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetAllAuthorPosterBoards',
            type: 'POST',
            data: JSON.stringify({ posterId: posterShortName }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data);
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function deleteAuthorPosterBoardService(posterShortName, authorPosterBoardId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/DeleteAuthorPosterBoard',
            type: 'POST',
            data: JSON.stringify({ posterShortName: posterShortName, posterBoardId: authorPosterBoardId }),

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
function saveAuthorPosterBoardSettingsService(inputData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SaveAuthorPosterBoardSettings',
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

function getPosterCommentsService(posterShortName, excludeReplyComments) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetPosterComments',
            type: 'POST',
            data: JSON.stringify({ posterShortName: posterShortName, excludeReplyComments: excludeReplyComments }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function postNewCommentService(posterShortName, commentText, isWatchDog, captchaResponse, watchdogUserName = "", watchdogUserEmail = "") {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/PostNewComment',
            data: JSON.stringify({ posterShortName: posterShortName, commentText: commentText, isWatchDog: isWatchDog, captchaResponse: captchaResponse, watchdogUserName: watchdogUserName, watchdogUserEmail: watchdogUserEmail }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function postNewReplyService(posterShortName, referenceCommentId, replyText, isWatchDog, captchaResponse, watchdogUserName = "", watchdogUserEmail = "") {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/PostNewReply',
            data: JSON.stringify({ posterShortName: posterShortName, referenceCommentId: referenceCommentId, replyText: replyText, isWatchDog: isWatchDog, captchaResponse: captchaResponse, watchdogUserName: watchdogUserName, watchdogUserEmail: watchdogUserEmail }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function changeCommentFlagService(commentId, posterShortName, isWatchDog = false, watchdogUserName = "", watchdogUserEmail = "") {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/ChangeCommentFlag',
            type: 'POST',
            data: JSON.stringify({ commentId: commentId, posterShortName: posterShortName, isWatchDog: isWatchDog, watchdogUserName: watchdogUserName, watchdogUserEmail: watchdogUserEmail }),

            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function deleteCommentService(posterShortName, commentId, isWatchDog = false, watchdogUserName = "", watchdogUserEmail = "") {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/DeleteComment',
            type: 'POST',
            data: JSON.stringify({ posterShortName: posterShortName, commentId: commentId, isWatchDog: isWatchDog, watchdogUserName: watchdogUserName, watchdogUserEmail: watchdogUserEmail }),

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
function getPosterCommentSettingsService(iswatchdog) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetPosterCommentSettings',
            type: 'POST',
            data: JSON.stringify({ isWatchDog: iswatchdog }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function validateGoogleCaptchaResponseService(response) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/ValidateGoogleCaptchaResponse',
            type: 'POST',
            data: JSON.stringify({ response: response }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error)
            },
        });
    });
}
function updateUserInfoForCommentsService(name, email, isWatchDog, captchaResponse) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/UpdateUserInfoForComments',
            type: 'POST',
            data: JSON.stringify({ name: name, emailAddress: email, isWatchDog: isWatchDog, captchaResponse: captchaResponse ? captchaResponse : '' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}
function getExistingUserInfoForCommnetService() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetExistingUserInfoForCommnet',
            type: 'POST',
            //data: JSON.stringify({ name: name, emailAddress: email }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}
function getEmailVerificationStatusForCommnetForSpeceficEmailService(email) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetEmailVerificationStatusForCommnetForSpeceficEmail',
            type: 'POST',
            data: JSON.stringify({ emailAddress: email }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}
function validateEmailForCommnetService(email, name) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/ValidateEmailForCommnet',
            type: 'POST',
            data: JSON.stringify({ emailAddress: email, name: name }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(JSON.parse(data.d));
            },
            error: function (error) {
                reject(error);
            },
        });
    });

}
function getGoogleCaptchaPublicKey() {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetGoogleCaptchaPublicKey',
            type: 'POST',
            data: null,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            },
        });
    });
}
//iPoster Version History
function getTheLastNPosterRevisionsService(posterShortName, countLatest, countHourly, countDaily) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/GetTheLastNPosterRevisions',
            type: 'POST',
            data: JSON.stringify({ posterShortName: posterShortName, countLatest: countLatest, countHourly: countHourly, countDaily: countDaily }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error)
            },
        })
    })
}
function deleteSurveyLink(posterShortName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: '/Templates/iPosters/iPosterService.asmx/DeleteSurveyLink',
            type: 'POST',
            data: JSON.stringify({ posterShortName: posterShortName }),

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
function createSurveyLink(posterShortName, surveyLink) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/CreateSurveyLink',
            data: JSON.stringify({ posterShortName: posterShortName, surveyLink: surveyLink }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let jsonData = JSON.parse(data.d);
                resolve(jsonData);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function generateTranscript(posterShortName, audioLink, transcriptMap) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/GenerateTranscript',
            data: JSON.stringify({ posterShortName: posterShortName, audioLink: audioLink, autoSave: transcriptMap == null }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let result = data.d;
                if (transcriptMap == null) {
                    resolve(result);
                } else {
                    transcriptMap[audioLink] = "job:" + result.job;
                    $.ajax({
                        type: "POST",
                        url: '/Templates/iPosters/iPosterService.asmx/AutoSaveContentTranscripts',
                        data: JSON.stringify({ posterShortName: posterShortName, data: JSON.stringify(transcriptMap) }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function () {
                            resolve(result);
                        },
                        error: function (error) {
                            console.log("Auto-save of transcript status -- job " + result.job + " failed: " + JSON.stringify(error));
                            resolve(result); // if auto-save fails, just proceed anyway. Data will be saved by ordinary save later.
                        }
                    });
                }
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function refreshTranscriptStatus(posterShortName, audioLink, job, transcriptMap) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/RefreshTranscriptStatus',
            data: JSON.stringify({ posterShortName: posterShortName, job: job, autoSave: transcriptMap == null }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let result = data.d;
                if (transcriptMap == null || !result.status) {
                    resolve(result);
                } else {
                    transcriptMap[audioLink] = result.text;
                    $.ajax({
                        type: "POST",
                        url: '/Templates/iPosters/iPosterService.asmx/AutoSaveContentTranscripts',
                        data: JSON.stringify({ posterShortName: posterShortName, data: JSON.stringify(transcriptMap) }),
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function () {
                            resolve(result);
                        },
                        error: function (error) {
                            console.log("Auto-save of generated transcript text failed: " + error);
                            resolve(result); // if auto-save fails, just proceed anyway. Data will be saved by ordinary save later.
                        }
                    });
                }
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function generateSubtitles(posterShortName, videoLink) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/GenerateSubtitles',
            data: JSON.stringify({ posterShortName: posterShortName, videoLink: videoLink }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function refreshSubtitleStatus(posterShortName, videoLink) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/RefreshSubtitleStatus',
            data: JSON.stringify({ posterShortName: posterShortName, videoLink: videoLink }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function uploadSubtitles(videoSrc, vttContent) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/UploadMediaCompanionData',
            data: JSON.stringify({ main: videoSrc, type: "vtt", variant: "en", content: vttContent }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function generateSinglePdfThumbnailService(posterShortName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/GenerateSinglePdfThumbnail',
            data: JSON.stringify({ posterShortName: posterShortName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                let jsonData = JSON.parse(data.d);
                resolve(jsonData);
            },
            error: function (error) {
                reject(error);
            }

        });
    });
}

function savePageData(inputData) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SavePage',
            data: JSON.stringify({ indata: inputData }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function sendChatSatusChangedSignal(posterShortName, message) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/SendChatSatusChangedSignal',
            data: JSON.stringify({ posterShortName: posterShortName, message: message }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function joinClientToTheChannelService(channelId, userIdentity) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/JoinClientToTheChannel',
            data: JSON.stringify({ channelId: channelId, userIdentity: userIdentity }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}
function getCurrentActiveChatService(posterShortName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/GetCurrentActiveChat',
            data: JSON.stringify({ posterShortName: posterShortName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (error) {
                reject(error);
            }
        });
    });
}

function getPublishedNotificationsService(notificationsPageSize, notificationsPageIndex) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/GetPublishedNotifications',
            data: JSON.stringify({
                pageSize: notificationsPageSize,
                pageIndex: notificationsPageIndex
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                resolve(result.d);
            },
            error: function (result) {
                reject(result);
            }
        });
    });
}

function getUnreadNotificationsService(unreadNotifictionsPageSize) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/GetPublishedUnreadNotificationsForCurrentUser',
            data: JSON.stringify({
                pageSize: unreadNotifictionsPageSize
            }),
            contentType: "application/json",
            dataType: "json",
            success: function (result) {
                resolve(result.d);
            },
            error: function (result) {
                reject(result);
            }
        });
    });
}

function createNotificationReadsService(unreadNotificationIds) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/Templates/iPosters/iPosterService.asmx/CreateNotificationReads",
            contentType: "application/json",
            data: JSON.stringify({ notificationIds: unreadNotificationIds }),
            dataType: "json",
            success: function (result) {
                resolve(result.d);
            },
            error: function (result) {
                reject(result);
            }
        });
    });
}

async function areThereAnyMoreNotificationsServiceAsync(notificationsPageIndex, notificationsPageSize) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/Templates/iPosters/iPosterService.asmx/AreThereAnyMoreNotifications",
            contentType: "application/json",
            data: JSON.stringify({ currentPageIndex: notificationsPageIndex, pageSize: notificationsPageSize }),
            dataType: "json",
            success: function (result) {
                resolve(result.d);
            },
            error: function (result) {
                reject(result);
            }
        });
    });
}

async function areThereAnyMoreUnreadNotificationsServiceAsync() {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: "/Templates/iPosters/iPosterService.asmx/areThereAnyMoreUnreadNotifications",
            contentType: "application/json",
            data: null,
            dataType: "json",
            success: function (result) {
                resolve(result.d);
            },
            error: function (result) {
                reject(result);
            }
        });
    });
}

async function switchTemplateService(templateIdentifier, pageId, batchImportDataId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Static/iPosters/ChooseTemplate.aspx/SwitchTemplate',
            data: JSON.stringify({ templateIdentifier: templateIdentifier, pageId: pageId, batchImportDataId: batchImportDataId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (result) {
                reject(result);
            }
        });
    });
}

async function registerCeCreditService(posterShortName, visitorName, visitorEmail) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "POST",
            url: '/Templates/iPosters/iPosterService.asmx/registerCeCredit',
            data: JSON.stringify({ posterShortName: posterShortName, visitorName: visitorName, visitorEmail: visitorEmail }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                resolve(data.d);
            },
            error: function (result) {
                reject(result);
            }
        });
    });
}

