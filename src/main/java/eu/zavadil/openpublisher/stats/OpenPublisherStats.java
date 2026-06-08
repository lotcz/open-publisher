package eu.zavadil.openpublisher.stats;

import eu.zavadil.java.JavaHeapStats;
import lombok.Data;

@Data
public class OpenPublisherStats {

	private final JavaHeapStats javaHeap = JavaHeapStats.ofCurrent();
}
