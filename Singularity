# A singularity container recipe file for the UNIVERSAL-DATA-TOOL
Bootstrap: docker
From: node:12

%environment
    export LISTEN_PORT=3000

%post

    # Clone the repository
    bash -c "cd / \
        && git clone https://github.com/UniversalDataTool/universal-data-tool.git \
        && mv universal-data-tool/ /opt/"

    # Install the package
    npm install -g serv
    bash -c "cd /opt/universal-data-tool \
        && npm install \
        && npm run build"

%startscript
    npx serve -s "/opt/universal-data-tool/build" -p $LISTEN_PORT

%runscript
    npx serve -s /opt/universal-data-tool/build -p $LISTEN_PORT

%help
    A singularity container for running the UNIVERSAL-DATA-TOOL. For more information
    see https://github.com/UniversalDataTool/universal-data-tool/.

%labels
    Maintainer: Rick Staa
    Github: https://github.com/UniversalDataTool/universal-data-tool/
    Version: v1.0.0
    Type: Public
