export interface GPU {
  _id: string;
  gpu_name: string;
  brand: string;
  score: string;
  architecture: string;
  bandwidth: string;
  base_clock: string;
  boost_clock: string;
  bus_interface: string;
  cuda: string;
  die_size: string;
  fp16: string;
  fp32: string;
  fp64: string;
  foundry: string;
  generation: string;
  l1_cache: string;
  l2_cache: string;
  l3_cache: string;
  memory_bus: string;
  memory_clock: string;
  memory_size: string;
  memory_type: string;
  opencl: string;
  opengl: string;
  pixel_rate: string;
  power_connectors: string;
  process_node: string;
  rops: string;
  rt_cores: string;
  release_date: string;
  sm_count: string;
  shading_units: string;
  tdp: string;
  tmus: string;
  tensor_cores: string;
  texture_rate: string;
  transistors: string;
  type: string;
  vulkan: string;
}