import json
import sys
import os.path

# Allowed arguments and the files they associate to
argumentFilePairs = {"dev": ".env.development", "staging": ".env.staging", "prod": ".env.production"}
allowedArguments = []

# Only one argument should be passed in. argv[0] is reserved for the filename
if(len(sys.argv) != 2):
    print("Incorrect number of arguments passed. Exiting.")
    exit()

# Grab each dictionary key and append it to an allowed arguments list
for key in argumentFilePairs:
    allowedArguments.append(key)

# If argument supplied not in the list of allowed arguments, exit
if not(sys.argv[1] in allowedArguments):
    print("Argument not recognized. Exiting.")
    exit()

# Grab the file associated to the argument supplied. Replace path of argv[0] with name of file
file = sys.argv[0].replace('envreader.py', argumentFilePairs[sys.argv[1]])

# If unable to find the file, error and exit
if(os.path.exists(file) == False):
    print("Unable to find file associated with " + sys.argv[1])
    exit()

ret_str = ''

# Loop through every environment variable stored in file and return it as a string
with open(file) as json_file:
    data = json.load(json_file)

    # We first start with the parent (project), and then loop through keys on that project
    for key1, value1 in data.iteritems():
        for key2, value2 in value1.iteritems(): 
            ret_str += str(key1) + "." + str(key2) + "=" + str(value2) + " "

print(ret_str)