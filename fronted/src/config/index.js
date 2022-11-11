let env = "local"

const serverList = {
    local: "http://127.0.0.1:8080",
}

const host = serverList[env]


export {host}
