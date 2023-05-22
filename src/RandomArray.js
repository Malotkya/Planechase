/** Randomly Sorted Array
 * 
 * @author Alex Malotky
 */
export default class RandomArray extends Array{

    /** Will randomly fill the array from the reference array(destructive)
     * 
     * @param {Array?} arr 
     */
    constructor(arr){
        super();

        if(arr) {
            while(arr.length > 0){
                let index = Math.floor(Math.random() * arr.length);
                this.push(arr[index]);
                arr.splice(index, 1);
            }
        }

        this.current = -1; 
    }

    /** Next Item in Array
     * 
     * @returns {any}
     */
    next(){
        if(++this.current >= this.length)
            this.current = 0;

        return this[this.current];
    }
}