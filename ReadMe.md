# guildBot
Discord bot to manage guild functions for WoW classic.

## Setup
.env needs:
* discord bot token https://discordapp.com/developers/applications/
* google service account crentials (path to): https://cloud.google.com/iam/docs/service-accounts
* mongodb connect uri string

## Bot setup
* default prefix is !
* @botname to see the prefix
* !help to see commands
* !help gBotAdmin to see commands to configure use for guild bot permissions.
* Users with manage webhooks can also admin guild bot

## Calendar setup 
* !help setup to see calendar configuration commands
* Each discord channel can have its own calendar attached. Calendar can be admin'd from the channel or from a separate calendar channel (you'll have to mention the channel to which the targeted calendar is attached in order to manage that particular calendar) if you want to otherwise keep your channel clean. 
* You'll have to create a google calendar and share it with the google service account (allow it to manage events) so the bot can add & display events.

## Command List
Use !help <commandname> for details
​
#### SYSTEM
* !help       Displays all the available commands for your permission level.
​
#### CALENDAR
* !addevent   Add event to channel calendar.
* !invite     Share link to discord post for event RSVP
* !rsvp       Post and invitation to an event for RSVPs.
* !setup      Configure channel calendars.
* !upcoming   Post upcoming events.
​
#### GUILD
* !admin      Configure guild bot permissions and settings
* !cleanup    Cleanup bot messages

### Add Events
= addevent = 
Add event to channel calendar.

!addevent [YYYY/MM/DD] [STARTIME]-[ENDTIME] (end optional) [TITLE] ::: [DESCRIPTION](optional) [#CHANNEL](optional)

!addEvent 2019/11/22 7:30pm-10:30pm Molten Core ::: Invites start at 7pm

!addEvent 2019-12-31 5:00pm Onyxia's Lair ::: More Dots! #calendar

!addEvent 2020-01-15 6:00pm-7:00pm Scholomance ::: #lfg

!addEvent 2020-01-25 6:00pm UBRS

= addevent =

## ToDo
- [ ] work on cleanup command and enable
- [ ] edit/delete events
- [ ] better feedback/functions for posting RSVPs (so all reactions go to one post)
- [ ] Retrieve attendance status for an event
- [ ] add functionality for guild profession management / guild bank query