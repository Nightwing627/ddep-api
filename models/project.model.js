const mongoose = require('mongoose');

const ProjectSchema = mongoose.Schema({
    ProjectCode: String,
    ProjectName: String,
    CompanyName: String,
    InboundSetting: {type: {
        inbound_format:  { type: String },
        sync_type:     { type: String},
        ftp_server_link:     { type: String },
        host:   { type: String },
        port:   { type: String },
        login_name:   { type: String },
        password:   { type: String },

      },
    },
    OutboundSetting: {type: {
        outbound_format:  { type: String },
        sync_type_out:     { type: String},
        api_url:     { type: String },
      },
    },
    ScheduleSetting: {type: {
        Schedule_configure:  { type: String },
        schedule_type:     { type: String},
        occurs:     { type: String },
        recurs_count:     { type: String },
        recurs_time:     { type: String },
      },
    },
    //OutboundSetting: ProjectSchema.Types.Mixed,
    //ScheduleSetting: ProjectSchema.Types.Mixed,


}, {
    timestamps: true
});

module.exports = mongoose.model('Project', ProjectSchema);