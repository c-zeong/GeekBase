export interface CPU {
  _id: string;
  cpu_type: string;
  cpu_name: string;
  cpu_socket: string;
  compatible_chipsets: string;
  int_graphics: boolean;
  semiconductor_size: number;
  cpu_tdp: string;  // 改为 string 类型
  pcie: number;
  transistors: number;
  cpu_threads: number;
  total_clock_speed: string;
  turbo: number;
  unlocked_multiplier: boolean;
  l2_cache: number;
  l3_cache: number;
  l1_cache: number;
  clock_multiplier: number;
  passmark: number;
  passmark_s: number;
  cinebench_r20_multi: number;
  cinebench_r20_single: number;
  geekbench6_multi: number;
  geekbench6_single: number;
  gpu_name: string;
  gpu_turbo: number;
  opengl_version: string;
  opencl_version: string;
  ram_speed_max: number;
  max_mem_bandwidth: number;
  ddr_version: number;
  mem_channels: number;
  max_mem_size: number;
  mem_eec: boolean;
  directx_version: string;
}