import Group from "../models/group.js";

export async function createGrp (req,res){
    try{
    const {owner,invitedUser,projectAs,groupName,description}=req.body;
    const group = new Group({owner,invitedUser,projectAs,groupName,description});

    const x = await group.save();
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}

export async function deleteGrp (req,res){
    try{
    const {id}=req.params;
    const x = await Group.findByIdAndDelete({_id:id});
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}
export async function updateGrp (req,res){
    try{
    const {id}=req.params;
    const {owner,invitedUser,projectAs,groupName,description}=req.body;
    const x = await Group.findByIdAndUpdate(
        id,
        {owner,invitedUser,projectAs,groupName,description},
        {new : true}
    );
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}

export async function getallgroups (req, res) {
    try{
        
        const x = await Group.find().populate('invitedUser').exec();
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}
export async function searchGrpById (req, res) {
    try{
        const {id} = req.params;
        const x = await Group.findById({_id:id});
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}
