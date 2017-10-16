import * as tags from "./tags";

export function plasmidStart(tag : tags.Plasmid) : string
{
    let res = "";

    res += `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" `;

    if(tag.sequencelength)
        res += `sequencelength="${tag.sequencelength}" `;

    if(tag.plasmidheight)
        res += `plasmidheight="${tag.plasmidheight}" `;
    
    if(tag.plasmidwidth)
        res += `plasmidwidth="${tag.plasmidwidth}" `;
    
    res += `class="ng-scope ng-isolate-scope" `;

    if(tag.plasmidheight)
        res += `height="${tag.plasmidheight}"`;
    
    if(tag.plasmidwidth)
        res += `width="${tag.plasmidwidth}"`;

    res += ">";
    return res;
}

export function plasmidEnd() : string
{
    return `</svg>`;
}