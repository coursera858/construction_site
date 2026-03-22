
export const validateInput = (schema,values) =>{
    const result = schema.safeParse(values)
    
    if(result.success){
        return{
            success : true,
            data : values
        }
    }else{
        return {
            success : false,
            errors : result.error.issues
        }
    }
    
}