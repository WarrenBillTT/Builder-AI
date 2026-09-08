import mongoose, {Schema} from 'mongoose'

const MessagesSchema = new Schema({
    role: {type: String, enum: ["user", "assistant"], required: true},
    content: {type: String, required: true},
    timestamps: {type: Date, default: Date.now},
},{_id: false})

const PlannedFileSchema = new Schema({
    path: {type: String, required: true},
    description: {type: String, required: true}
},{_id: false})

const ProjectSchema = new Schema({
    name: {type: String, required: true, default: "Untitle Project"},
    description: {type: String, default: ""},
    files: {type: Schema.Types.Mixed, default: {}},
    messages: {type: [MessagesSchema], default: []},
    version: {type: Number, default: 0},
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true},
    published: {type: Boolean, default: false},
    status: {type: String, enum: ["pending", "generating", "revising", "completed", "failed"], default: "pending"},
    filesPlanned: {type: [PlannedFileSchema], default: []},
    filesGenerated: {type: [String], default: []},
    currentFile: {type: String, default: null},
    error: {type: String, default: null}
},{timestamps: true})

export const Project = mongoose.model('Project', ProjectSchema)

