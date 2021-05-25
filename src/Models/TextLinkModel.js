export const TextBackgroundType = {
    BLUE_BACKGROUND: 'BLUE_BACKGROUND',
    LINKS_BACKGROUND: 'LINKS_BACKGROUND'
}

export class LinkModel  {
    title;
    background;
    text;
    constructor(title, background, text = null) {
        this.title = title;
        this.background = background;
        this.text = text;
    }
}
const SPACE = " ".repeat(20);

let NETWORK = [
    "A Network is not just an arrangement of intersecting horizontal and vertical lines or a group or a system of interconnected things. It is a framework for organising and conceptualising non-linear complexity.",
    SPACE,
    "A network comprises of three basic units:",
    SPACE,
    "Links",
    SPACE,
    "This is the fundamental unit of the network. These are the processes/occasions of relational experience, feeling information, that produce nodes.",
    SPACE,
    "Nodes",
    SPACE,
    "These are the dynamic products formed through the intersections between links.",
    SPACE,
    "These nodes have subjective experience and agency to actualise desires and communicate within the context of other nodes.",
    SPACE,
    "The realisation of  a process converts societies of embodied nodes into information or images.",
    SPACE,
    "This feeds into the subjective experience of future nodes", 
    SPACE,
    "Hence, embodied nodes hold a sequence of abstract images of the mesh or mirror the mesh"
]

let MONT_PELERIN = [
    "This is a film about the emergence of the Mont Pelerin society and the role it’s founders played in the reconstruction of the global society through the creation of institutions and redefinition of their guiding principles.",
    SPACE,
    SPACE,
    "Pelerin Palace also known as Hotel Du Parc was built in 1906 in Le Mont-Pelerin, Vaud, Switzerland overlooking Lake Geneva. It was designed in the Belle-Epoque style playing host to Edwardian Society. It was a haven for the rich and secretive in the Swiss Alps and became the birthplace of the Mont Pelerin society in 1947",
    SPACE,
    "Spearheaded by Freidrich von Hayek on April 1st to 10th,1947, an Austrian-British economist, the Mont Pelerin Society was created as a space for liberal intellectuals to create a framework for a new type of social organisation.",
    SPACE,
    "It’s aim was to create a new liberalism, one different from the state planning of the interwar and postwar years and the laissez faire liberalism of the 19th century.",
    SPACE,
    "They set out to create a framework to redefine the role sovereign states played in money circulation/flows. switching from a state that played a direct role in economic activities of its citizens to a state that defined and enforced the rules that govern and coordinated economic activity.",
    SPACE,
    "A switch from government to governance.",
    SPACE,
    "This was necessary to fight what they considered to be a dangerous turn toward collectivism in the postwar world."
]

NETWORK = NETWORK.map((line) => {
    return line.replace(" ", "  ")
})

export const LinkText = {
    NETWORK: NETWORK.join(' '),
    POWER: '“Power is diffusive rather than concentrated,embodied and enacted rather than possessed “. Power here is a function of intersection of links and the communication flowing through the links. Therefore, it is not an entity wielded by individual nodes.',
    FREEDOM: 'Negative Freedom is the absence of obstacles, barriers and constraints from outside entities. In liberal tradition, it is attributed to individual agents. It can also be defined as ‘freedom from’. Therefore, one can’t ‘experience’ this form of freedom but it allows one to act (in this model, communicate or feel information) without obstruction to others.',
    COMMUNICATION: 'A communication system consists of essentially five parts: Information Source, Transmitter, Channel, Receiver, Destination',
    MONT_PELERIN: MONT_PELERIN
}