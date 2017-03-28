import { FlowRouter } from 'meteor/kadira:flow-router';
import { Images, Groups } from '../../../../api/groups/collections.js';
import { Events } from '../../../../api/events/collections.js';
import { throwError } from '../../../../api/errors/error.js';

import './group-item.html';

Template.groupItem.onCreated(function () {
	const groupId = FlowRouter.getParam('groupId');
	Meteor.subscribe('groupItem', groupId, function(){
			const group = Groups.find({_id: FlowRouter.getParam('groupId')}).fetch()[0];
			Meteor.subscribe('images', group.logo);
	});
	Meteor.subscribe('users');
})
Template.groupItem.helpers({
	'groupData'(){
		const group = Groups.find({_id: FlowRouter.getParam('groupId')}).fetch()[0];
		const data = {};
		data.name = group.name;
		data.logoUrl = Images.find({_id: group.logo}).fetch()[0].url();
		data.groupParticipants = Meteor.users.find(
				{ $and: [
					{'profile.group': FlowRouter.getParam('groupId')},
					{ $or: [
						{'profile.groupAdmin': false },
						{"profile.groupAdmin": { $exists: false}}] 
					}
				]},
				{ fields: {_id: 1, profile: 1 }});
		data.menu = group.menu;
		data.admin = Meteor.users.find({_id: group.admin}).fetch()[0];
		return data
	},
	'addParticipantsList'(){
		const users = Meteor.users.find({ $or: [
			{"profile.group": null},
			{"profile.group": {$exists: false}},
			{ fields: {_id: 1, profile: 1 }}
		]});
		return users;
	},
	'isGrouppAdmin'(){
		const profile = Meteor.user().profile;
		return profile.group == FlowRouter.getParam('groupId') && profile.groupAdmin;
	}
});

Template.groupItem.events({
	'click .add-participant-but': function(e, t){
		const userId = $(e.target).attr('id');
		const groupId = FlowRouter.getParam('groupId');
		Meteor.call('addParticapant', userId, groupId, function (err) {
			if(err){
				throwError(err.reason);
			}
		})
	},
	'click .remove-participant-but': function(e, t){
		const userId = $(e.target).attr('id');
		const groupId = FlowRouter.getParam('groupId');
		Meteor.call('removeParticipant', userId, groupId, function (err) {
			if(err){
				throwError(err.reason);
			}
		})
	},
	'click #remove-group-but': function(e, t){
		const groupId = FlowRouter.getParam('groupId');
		Meteor.call('removeGroup', groupId, function (err) {
			if(err){
				throwError(err.reason);
			}
			else
				FlowRouter.go('/groups');
		})
	},
	'click #add-menu-but': function(e, t){
		e.preventDefault();
		const name = $('#name-of-pizza-in').val();
		const price = $('#price-in').val();
		const groupId = FlowRouter.getParam('groupId');
		Meteor.call('addMenuItem', groupId, name, price, function(err){
			if(err){
				throwError(err.reason);
			}
		})
	},
	'click .remove-menu-but': function(e, t){
		e.preventDefault();
		const name =  $(e.target).attr('name');
		const groupId = FlowRouter.getParam('groupId');
		Meteor.call('removeMenuItem',groupId,name, function(err){
			if (err){
				throwError(err.reason);
			}
		});
	},
	'click #create-event-but': function (e, t){
		e.preventDefault();
		const groupId = FlowRouter.getParam('groupId');
		Meteor.call('createEvent',groupId, function(err){
			if (err){
				throwError(err.error);
			}
			else{
				Meteor.setTimeout(function () {
					const eventId = Events.find({group: groupId}).fetch()[0]._id;
					Meteor.call('clearUnconfirmedParticipants', eventId);
				}, 600000);
				FlowRouter.go('/events')
			}
		});
	}	
})
