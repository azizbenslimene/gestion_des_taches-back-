import Group from '../models/group.js';
import Project from '../models/project.js';



export async function addProject(req, res) {
    try {
        const { projectName, dateStartProj, dateEndProj, groupId } = req.body;

        // Vérification que groupId est défini
        if (!groupId) {
            return res.status(400).json({ error: "groupId est requis" });
        }

        // Recherche de l'équipe par son ID
        const group = await Group.findById(groupId);  // Directly pass groupId

        if (!group) {
            return res.status(404).json({ error: "Équipe non trouvée" });
        }

        // Création du projet avec référence à l'équipe existante
        const project = new Project({
            projectName,
            dateStartProj,
            dateEndProj,
            grp: group._id
        });

        const savedProject = await project.save();

        // Population des données de l'équipe dans la réponse
        const populatedProject = await Project.findById(savedProject._id).populate('grp');  // Use the saved project's ID

        res.status(200).json(populatedProject);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Erreur lors de la création du projet" });
    }
}




export async function deleteProj (req,res){
    try{
    const {id}=req.params;
    const x = await Project.findByIdAndDelete({_id:id});
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}
export async function updateProj  (req,res){
    try{
    const {id}=req.params;
    const {projectName,dateStartProj,dateEndProj}=req.body;
    const x = await Project.findByIdAndUpdate(
        id,
        {projectName,dateStartProj,dateEndProj},
        {new : true}
    );
    res.status(200).json(x);
} catch (e) {
    console.error(e);
    res.status(500).json({ error: "error" });
} 
}

export async function getAllProj  (req, res) {
    try{
        
        const x = await Project.find().populate('grp');
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}
export async function searchProjById (req, res) {
    try{
        const {id} = req.params;
        const x = await Project.findById({_id:id});
        res.status(200).json(x);
    
    }catch(e){
        console.error(e);
        res.status(500).json({ error: "error" });
    }
}