# Nadi - Your Offline Coding Co-Pilot

**Website** : [Link](https://nadicode.in/)

**Fine-tuned model license** : [Link](https://github.com/NandhaKishorM/Nadi-Desktop/blob/master/LLM_LICENSE.md)


Nadi is built on top of Jan

official github repo: https://github.com/janhq/jan


## Troubleshooting

As Nadi is in development mode, you might get stuck on a broken build.

To reset your installation:

1. Use the following commands to remove any dangling backend processes:

   ```sh
   ps aux | grep nitro
   ```

   Look for processes like "nitro" and "nitro_arm_64," and kill them one by one with:

   ```sh
   kill -9 <PID>
   ```

2. **Remove Nadi from your Applications folder and Cache folder**

   ```bash
   make clean
   ```

   This will remove all build artifacts and cached files:

   - Delete Nadi extension from your `~/Nadi/extensions` folder
   - Delete all `node_modules` in current folder
   - Clear Application cache in `~/Library/Caches/Nadi`

## Requirements for running Nadi
- MacOS: 13 or higher
- Windows:
  - Windows 10 or higher
  - To enable GPU support:
    - Nvidia GPU with CUDA Toolkit 11.4 or higher
    - Nvidia driver 470.63.01 or higher
- Linux:
  - glibc 2.27 or higher (check with `ldd --version`)
  - gcc 11, g++ 11, cpp 11 or higher, refer to this [link](https://jan.ai/guides/troubleshooting/gpu-not-used/#specific-requirements-for-linux) for more information
  - To enable GPU support:
    - Nvidia GPU with CUDA Toolkit 11.4 or higher
    - Nvidia driver 470.63.01 or higher



### Pre-requisites

- node >= 20.0.0
- yarn >= 1.22.0
- make >= 3.81

### Instructions

1. **Clone the repository and prepare:**

    ```bash
    git clone https://github.com/NandhaKishorM/Nadi-Desktop.git
    cd Nadi
    git checkout -b DESIRED_BRANCH
    ```

2. **Run development and use Nadi Desktop**

    ```bash
    make dev
    ```

This will start the development server and open the desktop app.

### For production build

```bash
# Do steps 1 and 2 in the previous section
# Build the app
make build
```

This will build the app MacOS m1/m2 for production (with code signing already done) and put the result in `dist` folder.

## Acknowledgements

Nadi builds on top of other open-source projects:

- [llama.cpp](https://github.com/ggerganov/llama.cpp)
- [TensorRT](https://github.com/NVIDIA/TensorRT)



## License

Nadi is under AGPLv3 license.
