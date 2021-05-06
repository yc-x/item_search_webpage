export class SearchForm1 {
	constructor(public keyword: string,
	public category: string,
	public distance: number,
	public newProd?: boolean,
	public used?: boolean,
	public unspecified?: boolean,
	public locPick?: boolean,
	public freeShip?: boolean,
	public currLoc?: boolean,
	public other?: boolean,
	public zip?: string,

	){}
}
