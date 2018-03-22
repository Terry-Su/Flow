import { isNil } from "lodash";


export default function ( value: any ) {
	const res = ! isNil( value )
	return res
}
