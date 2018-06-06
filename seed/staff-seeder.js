var  Staff = require('../models/staff');
mongoose.connect('mongodb://localhost/internet');

var staff =  [
    new Staff({
        title: 'PHP Developer',
        name: 'Ahmed Maher',
        image: 'https://media.licdn.com/dms/image/C4D03AQG-GrULytCBgw/profile-displayphoto-shrink_200_200/0?e=1529744400&v=beta&t=Ayf9n9NcA-wsjh3ZEEzB8K9EQlzIcwdkwX2rc9UKHfk'
    }),
    new Staff({
        title: 'IOS Developer',
        name: 'Mohamed Maazy',
        image: 'https://media.licdn.com/dms/image/C4D03AQG-GrULytCBgw/profile-displayphoto-shrink_200_200/0?e=1529744400&v=beta&t=Ayf9n9NcA-wsjh3ZEEzB8K9EQlzIcwdkwX2rc9UKHfk'
    }),
    new Staff({
        title: 'PHP Developer',
        name: 'Amir Helmy',
        image: 'https://media.licdn.com/dms/image/C4D03AQG-GrULytCBgw/profile-displayphoto-shrink_200_200/0?e=1529744400&v=beta&t=Ayf9n9NcA-wsjh3ZEEzB8K9EQlzIcwdkwX2rc9UKHfk'
    })

];

var done = 0;
for(var i = 0;i<staff.length; i++){
    staff[i].save(function (err, result) {
        done++;
        if(done === staff.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}