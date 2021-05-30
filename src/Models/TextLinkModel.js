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

let BURNING_MAN = [
    "This is a film about the emergence of principles through the desires and behaviours in the earlier Burning Man gatherings",
    SPACE,
    SPACE,
    "The Burning Man festival began as a bonfire ritual in 1986 by a loosely affiliated group of disenfranchised artists. There were no defined founding principles. Only young bohemians and free spirits expressing what they felt to be their true selves and building community.",
    "Principles soon emerged.",
    SPACE,
    SPACE,
    "Radical Inclusion",
    SPACE,
    "Gifting",
    SPACE,
    "Decommodification",
    SPACE,
    "Radical self-reliance",
    SPACE,
    "Radical Self-expression",
    SPACE,
    "Communal Effort",
    SPACE,
    "Civic Responsibility",
    SPACE,
    "Participation",
    SPACE,
    "Immediacy",
    SPACE,
    "These principles emerged through shared experiences of events in the earlier gatherings. ",
    SPACE,
    "A result of complex social interactions",
    SPACE,
    "A framework or a set of protocols in which the nodes can communicate. However, these principles seemed to contradict each other such as; Radical self-reliance and Communal efforts.",
    SPACE,
    "Hence, the principles are not commandments or requests, each actor is free to exert their positive freedoms but the principles are internalised and the actors desires are produced through interactions in the network.",
    SPACE,
    "Within the network, the  principles act as  institutions entangled with all actors producing and consuming information.",
    SPACE,
    "Materialising in the tip-sheets handed out when entering the playa",
    SPACE,
    "An egregore embodying the principles hover the playa™ entangling the self-reliant individuals on their quest for self discovery"


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

BURNING_MAN = BURNING_MAN.map((line) => {
    return line.replace(" ", "  ")
})

MONT_PELERIN = MONT_PELERIN.map((line) => {
    return line.replace(" ", "  ")
})

export const LinkText = {
    NETWORK: NETWORK.join(' '),
    POWER: '“Power is diffusive rather than concentrated,embodied and enacted rather than possessed “. Power here is a function of intersection of links and the communication flowing through the links. Therefore, it is not an entity wielded by individual nodes.',
    FREEDOM: 'Negative Freedom is the absence of obstacles, barriers and constraints from outside entities. In liberal tradition, it is attributed to individual agents. It can also be defined as ‘freedom from’. Therefore, one can’t ‘experience’ this form of freedom but it allows one to act (in this model, communicate or feel information) without obstruction to others.',
    COMMUNICATION: 'A communication system consists of essentially five parts: Information Source, Transmitter, Channel, Receiver, Destination',
    MONT_PELERIN: MONT_PELERIN.join(' '),
    BURNING_MAN: BURNING_MAN.join(' ')
}