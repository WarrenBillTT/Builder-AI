import { Project } from "../models/Project.js";
import crypto from "crypto"

function hashContent(content){
    return crypto.createHash("md5").update(content).digest("hex").slice(0, 12)
}

// POST /api/projects
// Create a new project from an AI prompt.
export async function createProject(req, res){
    const {prompt} = req.body;
    if(!prompt || typeof prompt !== 'string'){
        res.status(400).json({error: "prompt is required"});
        return;
    }

    if(!req.user){
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    // Create project in DB immediately with "pending" status
    const project = await Project.create({
        name: "Planning project...",
        description: prompt,
        files: {},
        messages: [
            {role: "user", content: prompt},
            {role: "assistant", content: "Planning project structure..."},
        ],
        version: 0,
        owner: req.user.userId, 
        status: "pending",
        filesPlanned: [],
        filesGenerated: [],
        currentFile: null,
        error: null,
    })

    // Start background generation
    runBackgroundGeneration(project._id.toString(), prompt).catch((err)=>{
        console.error(`[Background AI] Fatal generation error for project ${project._id}:`, err)
    })

    res.status(201).json({
        _id: project._id,
        name: project.name,
        description: project.description,
        files: {},
        messages: project.messages,
        version: project.version,
        status: project.status,
        filesPlanned: project.filesPlanned,
        filesGenerated: project.filesGenerated,
        currentFile: project.currentFile,
        error: project.error,
        createdAt: project.createdAt,
    })
}

// Background worker to progressive generate files and update database in real-time.
async function runBackgroundGeneration(projectId, prompt){

}

// GET /api/projects
// List all projects owned by the user (summary only, no file contents).
export async function listProjects(req, res){
    if(!req.user){
        res.status(401).json({error: "Unauthorized"});
        return;
    }
    const projects = await Project.find(
        {owner: req.user.userId},
        {name: 1, description: 1, version: 1, createdAt: 1, updatedAt: 1}
    ).sort({updatedAt: -1});

    res.json(projects)
}

// GET /api/projects/:id
// Get full project details.
export async function getProject(req, res){
    if(!req.user){
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    const project = await Project.findOne({_id: req.params.id, owner: req.user.userId})

    if(!project){
        res.status(404).json({error: "Project not found"});
        return;
    }

    const filesObj = {};
    for(const [path, entry] of Object.entries(project.files)){
        filesObj[path] = entry.content;
    }

    res.json({
        _id: project._id,
        name: project.name,
        description: project.description,
        files: filesObj,
        messages: project.messages,
        version: project.version,
        status: project.status,
        filesPlanned: project.filesPlanned,
        filesGenerated: project.filesGenerated,
        currentFile: project.currentFile,
        error: project.error,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    })
}

// DELETE /api/projects/:id
// Delete a project.
export async function deleteProject(req, res){
    if(!req.user){
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    const result = await Project.findOneAndDelete({_id: req.params.id, owner: req.user.userId})
    if(!result){
        res.status(404).json({error: "Project not found"});
        return;
    }
    res.json({success: true})
}

// PUT /api/projects/:id/files
// Update project files (manual edits).
export async function updateProjectFiles(req, res){
    const {files} = req.body;
    if(!files || typeof files !== 'object'){
        res.status(400).json({error: "files object is required"});
        return;
    }

    if(!req.user){
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    const project = await Project.findOne({_id: req.params.id, owner: req.user.userId})

    if(!project){
        res.status(404).json({error: "Project not found"});
        return
    }

    // Rebuild project files map with content & hashes
    const newFiles = {};
    for (const [path, content] of Object.entries(files)){
        if(typeof content === "string"){
            newFiles[path] = {content, hash: hashContent(content)}
        }
    }

    project.files = newFiles;
    await project.save();

    const filesObj = {};
    for(const [path, entry] of Object.entries(project.files)){
        if(typeof content === "string"){
            filesObj[path] = entry.content;
        }
    }

    res.json({
        _id: project._id,
        name: project.name,
        description: project.description,
        files: filesObj,
        messages: project.messages,
        version: project.version,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
    })
}

// POST /api/projects/:id/publish
// Mark a project as publicly published.
export async function publishProject(req, res){
    if(!req.user){
        res.status(401).json({error: "Unauthorized"});
        return;
    }

    const project = await Project.findOneAndUpdate(
        {_id: req.params.id, owner: req.user.userId},
        {published: true},
        {returnDocument: "after"}
    )

    if(!project){
        res.status(404).json({error: "Project not found"});
        return;
    }

    res.json({success: true, published: project.published});
}

// Get /api/projects/public/:id
// Get a publicly published project details (without auth).
export async function getPublicProject(req, res){
    const project = await Project.findById(req.params.id);
    if(!project){
        res.status(404).json({error: "Project not found"});
        return;
    }

    if(!project.published){
        res.status(403).json({error: "Project is not published yet"});
        return;
    }

    const filesObj = {};
    for(const [path, entry] of Object.entries(project.files)){
        filesObj[path] = entry.content;  
    }

    res.json({
        _id: project._id,
        name: project.name,
        description: project.description,
        files: filesObj,
        version: project.version,
    })
}