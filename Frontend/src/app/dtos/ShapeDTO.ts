export interface ShapeDTO{
    id?: string;
    type : string ;
    x1 : number ;
    y1 : number ;
    x2 : number ;
    y2 : number ;
    angle : number ;
    scaleX : number ;
    scaleY: number ;
    properties : {[key : string] : any}
}
