## Level 1
- `!command set-text|delete|usage|info <cmd> <text ...>` sets/queries custom commands
- `!ascii <text>` converts text to ascii art and prints result to chat
- `!plot <...function>` plot the function of a graph in ascii "art"
- `!channel add|remove <name>` add channel to the `!channel` list
- `!verify add|remove <trip> <name>` verifies that a certain username usually uses a certain tripcode

## Level 2
- `!ban remove <name>` removes the ban request for a certain username
- `!botBan <time> <name>` bans a user from using the bot for `time` seconds (`-1` means infinite)
- `!botUnban <name>` unbans a user from using the bot

## Level 3
Allows using `!command` on other peoples commands.

## Level 4
- `!sudo <user> !<command> <...args>` runs a command as the specified user

## Level 5
- `!config get|set|save` gets, sets and saves values in the config
- `!bot perm <name> <level>` gives permissions to users
- `!bot debug <name>` outputs the stringified version of a member of the bot object
