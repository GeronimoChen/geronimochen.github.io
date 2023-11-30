var posterHub = null;
var posterHub_currentPosterShortName = null;
var SignalR_ClientRole = {
    VISITOR: 'visitor',
    EDITOR: 'editor'
}
var NotifyType = {
    INFORMATION: 'info',
    WARNING: 'warning',
    DANGER: 'danger',
    SUCCESS: 'success',
}
var isPageLoadedInPreviewMode = function () {
    return typeof (guestView) != 'undefined' && guestView;
}
/*const NotifyType = {}*/
$(function () {
    if (new URLSearchParams(location.search).get('thumbrenderer') !== 'true') {
        initializePosterNotifierConnection();
        if (!isPageLoadedInPreviewMode())
            initializeClientTrackerConnection($('#PageShortName').val(), Boolean.parse($('#EditMode').val()), Boolean.parse($('#AuthorLoggedIn').val()));
    }
});
function onHubdisconnectedEvent() {
    setTimeout(function () {
        $.connection.hub.start().done(onHubStartedEvent);
    }, 5000); // Restart connection after 5 seconds.
}
function onHubStartedEvent() {
    if (posterHub_currentPosterShortName) {
        posterHub.server.joinGroup(posterHub_currentPosterShortName);
    }

}
function notifyUser(message, type, duration) {
    let alertElement = `<div style="margin:5px!important;" class="alert alert-${type} no-wrap alert-dismissible" role="alert"><strong><i class="fa fa-info">:</i></strong> ${message} </div>`;
    $(alertElement).hide().appendTo('#alert-container').show('slide', { direction: 'right' }, 500).delay(duration).fadeOut(1000, function () { $(this).remove() });
}
function posterHub_getCurrentUserName() { return $("#ClientEmailAddress").val() };
function registerPosterHubClientMethods(posterHub) {
    posterHub.client.saveLogout = function () {
        callSaveLogout();
    }
    posterHub.client.notifyUser = function (notificationViewModel) {
        let posterHub_currentUserName = posterHub_getCurrentUserName();
        //poster short name is checked in back-end: notifications is sent just to this poster clients
        if (!notificationViewModel.UserName || posterHub_currentUserName == notificationViewModel.UserName) {
            notifyUser(notificationViewModel.NotificationMessage, notificationViewModel.Type, notificationViewModel.VisibleTimeDuration);
        }
    }
    posterHub.client.notifyChatStatusChanges = function (message) {
        if (newBroadcastedMessageReceivedEvent)
            newBroadcastedMessageReceivedEvent(message);
        else setTimeout(function (message) {
            newBroadcastedMessageReceivedEvent(message);
        }, 1000, message)
    }

}
function initializePosterNotifierConnection() {
    posterHub = $.connection.posterHub;
    if (!posterHub) {
        return console.error('posterHub does not have value.');
    }
    posterHub_currentPosterShortName = $('#PageShortName').val();
    registerPosterHubClientMethods(posterHub);
    $.connection.hub.disconnected(onHubdisconnectedEvent);
    $.connection.hub.start().done(onHubStartedEvent);

}
function initializeClientTrackerConnection(posterShortName, pageIsLoadedInEditMode) {
    let clientRole = pageIsLoadedInEditMode === true ? SignalR_ClientRole.EDITOR : SignalR_ClientRole.VISITOR;
    $.connection.hub.qs = { shortName: posterShortName, role: clientRole }
    var realTimeClientTrackerHub = $.connection.realTimeClientTrackerHub;
    $.connection.hub.disconnected(onRealTimeClientTrackerHubDisconnectedEvent);

    realTimeClientTrackerHub.client.updateUsersOnlineCount = updateOnlineVisitorIndicator;
    $.connection.hub.start().done(onRealTimeClientTrackerHubStartedEvent);

    function onRealTimeClientTrackerHubStartedEvent() {
        if (Boolean.parse($('#EditMode').val()) == false)
            return;
        let result = realTimeClientTrackerHub.server.getOnlineVisitorsCount();
        result.then(function (result) {

            updateOnlineVisitorIndicator(result);
        });

    }
    function updateOnlineVisitorIndicator(value) {
        if (typeof (updateOnlineVisitorIndicatorUserInterface) != 'undefined')
            updateOnlineVisitorIndicatorUserInterface(value);
        else
            console.error('function updateOnlineVisitorIndicatorUserInterface not found.');
    }
    function onRealTimeClientTrackerHubDisconnectedEvent() {
        setTimeout(function () {
            $.connection.hub.start().done(onRealTimeClientTrackerHubStartedEvent);
        }, 5000); // Restart connection after 5 seconds.
    }
}


