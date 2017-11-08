import Profiles from '/imports/models/profiles.js';
import { HTTP } from 'meteor/http';

Profiles.allow({
    insert(userId, profile){
        // permission to insert only to authenticated users
        return userId !== null;
    },
    update(userId, profile, fieldNames, modifier){
        // permission to update only to party owner
        return true;
    },
    remove(userId, profile){
        // permission to remove only to party owner
        return true;
    },

});

Meteor.publish('profiles', function (selector) {
    if(selector === null){
      selector = {};
    } else if(typeof selector === 'string' && selector.length){
        var searchString = {$regex: `.*${selector}.*`, $options: 'i'}
        selector = { profiles_firstname: searchString };
        //return Meteor.users.find(selector);
    } else {
      selector = {profiles_userID: selector};
    }

    return Profiles.find(selector);
});

Meteor.publish('profiles2', function (selector) {
    if(selector === null){
      selector = {};
    } else {
      selector = {profiles_userID: selector};
    }

    return Profiles.find(selector);
});

Meteor.publish('profiles3', function () {
    return Profiles.find();
});

Meteor.methods({

    upsertProfileFromAdmin(profileID, profileFirstname, profileLastname, profilePhoto, profileType){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profile_Firstname: branchID,
        profile_Lastname: branchName,
        profile_profilephoto: profilePhoto,
        profile_type: profileType
      }};
      var userUpsert = Profiles.upsert(selector, modifier);
      return userUpsert;
    },
    upsertProfilePhoto(profileID, downloadUrl){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
          profiles_profilephoto: downloadUrl
        }};
      var photoUpsert = Profiles.upsert(selector, modifier);
      return photoUpsert;
    },
    upsertProjectFromUser(profileID, userType, projectID){
      var selector = {profiles_userID: profileID};
      var modifier = {$set: {
        profiles_projectID: projectID
      }};
      var typeUpsert = Profiles.upsert(selector, modifier);
      return typeUpsert;
    },
    sendEmail(toEmail, toName){     
      var status = '';  
      HTTP.call("POST", "https://api.sendgrid.com/v3/mail/send", {
        data : {
          "personalizations": [
          {
            "to": [
              {
                "email": toEmail,
                "name": toName
              }
            ],
            "subject": "ClickCoupons Registration Successful"
          }
        ],
        "from": {
          "email": "admin@couponclicks.io",
          "name": "Sam Smith"
        },
        "reply_to": {
          "email": "admin@couponclicks.io",
          "name": "Sam Smith"
        },
        "subject": "Hello, World!",
        "content": [
          {
              "type": "text/html",
            "value": "<html><p>Thank you for registering at clickcoupons.io</p></html>"
          }
        ]}, 
        headers : {
          "Authorization" : "Bearer "
        }
    }, function (error, response){
        if(error){
          status = error;
          console.info('error', error);
        } else {
          status = response;
          console.info('response', response);
        }
      });
      console.info('status', status);
      return status;
      
    }


})
