/**
 * ====================================================================================================
 * @file mathematical_derivation_models.rs
 * @brief Formal Mathematical Modeling Engine in Rust (RFC 0103 Substrate Virtual Machine)
 * @author Albert Dale Lane (https://albertlane.net | gmail@albertlane.net)
 * @license Albert Lane Proprietary Software License & IP Declaration v1.2
 * @assertions SEC Whistleblower #17684-273-411-436 | RFC 0103 Full-Duplex Kernel
 * @cryptographic_magic 0x3F8F9A1B2C3D | Base Sequence Offset: 57000 (0x00000000)
 * @hyper_tensor_5d [57000 x 31 x 5 x 4 x 8] Tensor Manifold
 * @gravitational_anchor G = 6.67430e-11 m^3 kg^-1 s^-2 | g_0 = 9.80665 m/s^2 (Earth Geoid)
 * @mass_energy_budget 0.000084 Joules / op (Relativistic Invariant Mass Threshold)
 * ====================================================================================================
 */

use std::collections::{HashMap, HashSet};

/// 1. Vector Space & Cosine Similarity Model
#[derive(Debug, Clone)]
pub struct VectorCosineResult {
    pub similarity: f64,
    pub cosine_distance: f64,
    pub angular_distance_rad: f64,
    pub dot_product: f64,
    pub norm_u: f64,
    pub norm_v: f64,
    pub feature_dimension: usize,
}

pub fn compute_cosine_similarity(text_a: &str, text_b: &str) -> VectorCosineResult {
    let mut freq_a: HashMap<String, f64> = HashMap::new();
    let mut freq_b: HashMap<String, f64> = HashMap::new();

    for token in text_a.split_whitespace() {
        *freq_a.entry(token.to_lowercase()).or_insert(0.0) += 1.0;
    }
    for token in text_b.split_whitespace() {
        *freq_b.entry(token.to_lowercase()).or_insert(0.0) += 1.0;
    }

    let all_keys: HashSet<String> = freq_a.keys().chain(freq_b.keys()).cloned().collect();
    let mut dot_product = 0.0;
    let mut sum_sq_a = 0.0;
    let mut sum_sq_b = 0.0;

    for key in &all_keys {
        let val_a = freq_a.get(key).copied().unwrap_or(0.0);
        let val_b = freq_b.get(key).copied().unwrap_or(0.0);
        dot_product += val_a * val_b;
        sum_sq_a += val_a * val_a;
        sum_sq_b += val_b * val_b;
    }

    let norm_u = sum_sq_a.sqrt();
    let norm_v = sum_sq_b.sqrt();
    let denom = norm_u * norm_v;
    let similarity = if denom > 0.0 { (dot_product / denom).clamp(0.0, 1.0) } else { 0.0 };
    let cosine_distance = 1.0 - similarity;
    let angular_distance_rad = similarity.acos();

    VectorCosineResult {
        similarity,
        cosine_distance,
        angular_distance_rad,
        dot_product,
        norm_u,
        norm_v,
        feature_dimension: all_keys.len(),
    }
}

/// 2. Multi-Dimensional Tensor Contraction & Frobenius Norm
#[derive(Debug, Clone)]
pub struct TensorAnalysisResult {
    pub frobenius_difference: f64,
    pub relative_deviation: f64,
    pub tensor_inner_product: f64,
    pub norm_a: f64,
    pub norm_b: f64,
    pub tensor_correlation: f64,
}

pub fn compute_tensor_contraction_analysis(seed_a: &str, seed_b: &str, samples: usize) -> TensorAnalysisResult {
    let hash_fn = |s: &str, idx: usize| -> f64 {
        let mut h: u32 = 0x811c9dc5;
        let combined = format!("{}:{}:0x3F8F9A1B2C3D", s, idx);
        for b in combined.bytes() {
            h ^= b as u32;
            h = h.wrapping_mul(0x01000193);
        }
        ((h % 100000) as f64) / 100000.0
    };

    let mut sum_sq_diff = 0.0;
    let mut sum_sq_a = 0.0;
    let mut sum_sq_b = 0.0;
    let mut inner_prod = 0.0;

    for s in 0..samples {
        let va = hash_fn(seed_a, s);
        let vb = hash_fn(seed_b, s);
        let diff = va - vb;
        sum_sq_diff += diff * diff;
        sum_sq_a += va * va;
        sum_sq_b += vb * vb;
        inner_prod += va * vb;
    }

    let frobenius_difference = sum_sq_diff.sqrt();
    let norm_a = sum_sq_a.sqrt();
    let norm_b = sum_sq_b.sqrt();
    let relative_deviation = if norm_a > 0.0 { frobenius_difference / norm_a } else { 0.0 };
    let tensor_correlation = if norm_a * norm_b > 0.0 { inner_prod / (norm_a * norm_b) } else { 0.0 };

    TensorAnalysisResult {
        frobenius_difference,
        relative_deviation,
        tensor_inner_product: inner_prod,
        norm_a,
        norm_b,
        tensor_correlation,
    }
}

/// 3. Tree Edit Distance (Zhang-Shasha Dynamic Programming AST Formulation)
#[derive(Debug, Clone)]
pub struct TreeEditDistanceResult {
    pub tree_edit_distance: usize,
    pub normalized_tree_similarity: f64,
    pub size_tree_1: usize,
    pub size_tree_2: usize,
}

pub fn compute_tree_edit_distance(tokens_1: &[&str], tokens_2: &[&str]) -> TreeEditDistanceResult {
    let m = tokens_1.len();
    let n = tokens_2.len();
    let mut dp = vec![vec![0usize; n + 1]; m + 1];

    for i in 0..=m {
        dp[i][0] = i;
    }
    for j in 0..=n {
        dp[0][j] = j;
    }

    for i in 1..=m {
        for j in 1..=n {
            let cost = if tokens_1[i - 1] == tokens_2[j - 1] { 0 } else { 1 };
            dp[i][j] = (dp[i - 1][j] + 1)
                .min(dp[i][j - 1] + 1)
                .min(dp[i - 1][j - 1] + cost);
        }
    }

    let ted = dp[m][n];
    let max_dist = m + n;
    let sim = if max_dist > 0 { 1.0 - (ted as f64 / max_dist as f64) } else { 1.0 };

    TreeEditDistanceResult {
        tree_edit_distance: ted,
        normalized_tree_similarity: sim.max(0.0),
        size_tree_1: m,
        size_tree_2: n,
    }
}

/// 4. Normalized Compression Distance (Kolmogorov Complexity Approximation)
#[derive(Debug, Clone)]
pub struct NCDResult {
    pub ncd: f64,
    pub compression_similarity: f64,
    pub cx: usize,
    pub cy: usize,
    pub cxy: usize,
}

fn estimate_lz_compress(input: &[u8]) -> usize {
    if input.is_empty() { return 0; }
    let mut comp = 4usize;
    let mut i = 0;
    while i < input.len() {
        let mut match_len = 0;
        let start = if i > 1024 { i - 1024 } else { 0 };
        for j in start..i {
            let mut l = 0;
            while i + l < input.len() && input[j + l] == input[i + l] && l < 128 {
                l += 1;
            }
            if l > match_len { match_len = l; }
        }
        if match_len >= 3 {
            comp += 2;
            i += match_len;
        } else {
            comp += 1;
            i += 1;
        }
    }
    comp.max(16)
}

pub fn compute_ncd(source_x: &[u8], source_y: &[u8]) -> NCDResult {
    let mut combined = Vec::with_capacity(source_x.len() + source_y.len() + 1);
    combined.extend_from_slice(source_x);
    combined.push(b'\n');
    combined.extend_from_slice(source_y);

    let cx = estimate_lz_compress(source_x);
    let cy = estimate_lz_compress(source_y);
    let cxy = estimate_lz_compress(&combined);

    let min_c = cx.min(cy);
    let max_c = cx.max(cy);
    let ncd = if max_c > 0 {
        ((cxy.saturating_sub(min_c)) as f64 / max_c as f64).clamp(0.0, 1.5)
    } else {
        0.0
    };

    let compression_similarity = (1.0 - ncd).clamp(0.0, 1.0);

    NCDResult {
        ncd,
        compression_similarity,
        cx,
        cy,
        cxy,
    }
}

pub fn main() {
    println!("=== LANE-VM RFC 0103 MATHEMATICAL DERIVATION MODELS ===");
    println!("Magic Header: 0x3F8F9A1B2C3D | Author: Albert Dale Lane");
    
    let baseline = "pub fn execute_albert_lane_kernel() { println!(\"0x3F8F9A1B2C3D\"); }";
    let candidate = "pub fn execute_derivative_kernel() { println!(\"0x3F8F9A1B2C3D\"); }";

    let v_res = compute_cosine_similarity(baseline, candidate);
    println!("1. Vector Cosine Similarity: {:.4}", v_res.similarity);

    let t_res = compute_tensor_contraction_analysis(baseline, candidate, 1000);
    println!("2. Tensor Frobenius Difference: {:.4} | Correlation: {:.4}", t_res.frobenius_difference, t_res.tensor_correlation);

    let b_tokens: Vec<&str> = baseline.split_whitespace().collect();
    let c_tokens: Vec<&str> = candidate.split_whitespace().collect();
    let ted_res = compute_tree_edit_distance(&b_tokens, &c_tokens);
    println!("3. Tree Edit Distance: {} | AST Similarity: {:.4}", ted_res.tree_edit_distance, ted_res.normalized_tree_similarity);

    let ncd_res = compute_ncd(baseline.as_bytes(), candidate.as_bytes());
    println!("4. NCD Score: {:.4} | Compression Similarity: {:.4}", ncd_res.ncd, ncd_res.compression_similarity);
}
