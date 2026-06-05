package eu.zavadil.openpublisher.stats;

import org.springframework.stereotype.Service;

@Service
public class StatsService {

	public OpenPublisherStats getStats() {
		final OpenPublisherStats stats = new OpenPublisherStats();

		return stats;
	}
}
