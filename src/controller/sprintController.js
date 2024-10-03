import Sprint from "../models/sprint.js";

export async function createSprint (req,res){
    try{
    const {sprintName,dateStartSprint,dateEndSprint}=req.body;
    const project = new Sprint({sprintName,dateStartSprint,dateEndSprint});

    const x = await project.save();
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}

export async function deleteSprint (req,res){
    try{
    const {id}=req.params;
    const x = await Sprint.findByIdAndDelete({_id:id});
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}
export async function updateSprint  (req,res){
    try{
    const {id}=req.params;
    const {sprintName,dateStartSprint,dateEndSprint}=req.body;
    const x = await Sprint.findByIdAndUpdate(
        id,
        {sprintName,dateStartSprint,dateEndSprint},
        {new : true}
    );
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}

export async function searchSprint  (req, res) {
    try{
        
        const x = await Sprint.find();
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}
export async function searchSprintById (req, res) {
    try{
        const {id} = req.params;
        const x = await Sprint.findById({_id:id});
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}