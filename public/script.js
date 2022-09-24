async function signup(e){
    try{
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const res = await axios.post(`http://3.80.105.110:3000/user/signup/`,{name,email,password})

        if(res.status==201){
            console.log(res)
            document.getElementById('name').value="";
            document.getElementById('email').value="";
            document.getElementById('password').value="";
            window.location.href = "login.html";
        }
        else{
            throw new Error("Failed");
        }
    }
    catch(err){
        notification(err.response.data.message);
        console.log(err);
    }
}


async function forget(e){
    try{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const res = await axios.post(`http://3.80.105.110:3000/called/password/forgotpassword`,{email})
        console.log(res.data);
        notification(res.data.message);
        document.getElementById('email').value="";
    }
    catch(err){
        notification(err);
    }
}
async function login(e){
    try{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const res = await axios.post(`http://3.80.105.110:3000/user/login/`,{email,password})
        console.log(res);
        
        if(res.status==200){
            // alert("success")
            localStorage.setItem('token',res.data.token)
            window.location.href = "index.html";
            // notification(res.data.message);
            document.getElementById('email').value="";
            document.getElementById('password').value="";
        }
        else{
            throw new Error("Failed to Login");
        }
    }
    catch(err){
        notification(err.response.data.message);
    }
}


function notification(res){
    const container = document.getElementById('notification-container');
    const notif = document.createElement('div');
    notif.classList.add('toast');
    notif.innerHTML = `<h3><strong style="color:red;padding: 20px;">${res}</strong><h3>`;
    container.appendChild(notif);

    setTimeout(()=>{
        notif.remove();
    },4000)
}

