# DATABASE DESIGN

* User

- name -> [String - required - minlength:3 - maxlength:20 - trim:true]
- email -> [String - required - unique:true - trim:true - lowercase:true]
- password -> [String - in-case provider = local >> required]
- provider [Google - Facebook - 'local']
- isDeleted [boolean] – [default: false]
- isVerified [boolean] – [default: false]
- dob [Date]
- gender [String] - [Male - Female]
- twoStepVerification [boolean] – [default: false]
- failedLoginAttempts [Number] – [default: 0]
- banUntil [Date]
- createdAt [Date]
- updatedAt [Date]

-----------------------------

* Message

- content -> [String - required - trim:true - minlength:1 - maxlength:200]
- receiver -> [ObjectId - required - ref:'User']
- sender -> [ObjectId - ref:'User']
- isSenderRevealed -> [boolean] – [default: false]
- isDeleted -> [boolean] – [default: false]
- createdAt -> [Date]
- updatedAt -> [Date]

-------------------------------

* IdentityRequest

- message -> [ObjectId - required - unique:true - ref:'Message']
- requester -> [ObjectId - required - ref:'User'] (the message receiver)
- sender -> [ObjectId - required - ref:'User']
- status -> [String] - [pending - accepted - rejected] – [default: pending]
- createdAt -> [Date]
- updatedAt -> [Date]

-------------------------------

* Conversation

- participants -> [[ObjectId] - exactly 2 - ref:'User']
- message -> [ObjectId - required - unique:true - ref:'Message'] (the original message)
- createdAt -> [Date]
- updatedAt -> [Date]

-------------------------------

* ConversationMessage

- conversation -> [ObjectId - required - ref:'Conversation']
- sender -> [ObjectId - required - ref:'User']
- content -> [String - required - trim:true - minlength:1 - maxlength:200]
- createdAt -> [Date]
- updatedAt -> [Date]

-------------------------------

* OTP [one-time password]TODO: switch to Caching.

- code -> [String - required - length:6]
- email -> [String - required - trim:true - lowercase:true]
- expiresAt -> [Date] 2026-09-14T08:20:00.000Z 
- createdAt -> [Date] 2026-09-14T08:10:00.000Z

