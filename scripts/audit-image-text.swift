import Foundation
import ImageIO
import Vision

let root = URL(fileURLWithPath: CommandLine.arguments.dropFirst().first ?? "public", isDirectory: true)
let extensions = Set(["jpg", "jpeg", "png", "webp", "avif", "gif"])
let enumerator = FileManager.default.enumerator(at: root, includingPropertiesForKeys: nil)!
var inspected = 0
var matches = 0

for case let url as URL in enumerator {
    guard extensions.contains(url.pathExtension.lowercased()) else { continue }
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else { continue }
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.recognitionLanguages = ["en-US", "zh-Hans"]
    request.usesLanguageCorrection = false
    do {
        try VNImageRequestHandler(cgImage: image).perform([request])
    } catch {
        continue
    }
    inspected += 1
    let observations = (request.results ?? []).compactMap { $0.topCandidates(1).first }
    let text = observations.filter { $0.confidence >= 0.25 }.map(\.string).joined(separator: " | ")
    guard !text.isEmpty else { continue }
    matches += 1
    print("\(url.path)\t\(text.replacingOccurrences(of: "\t", with: " "))")
}
fputs("Inspected \(inspected) images, text detected in \(matches).\n", stderr)
