tools={

"browser":"browser_agent",

"vision":"camera_agent",

"memory":"memory_agent",

"terminal":"terminal_agent"

}

def execute_tool(tool_name, user_input):
    agent_executor = tools.get(tool_name, "chat")
    print(f"Routing task input '{user_input}' to engine: {agent_executor}")
    return agent_executor
